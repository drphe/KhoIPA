import json
import requests
import os
import re
from datetime import datetime
import time

def generate_bundle_id(install_url, app_id):
    """Tạo bundle ID từ install URL và app ID"""
    if not install_url:
        return f"flekstore.unknown"
    
    file_name = install_url.split('/')[-1]
    file_name = re.sub(r'\.ipa$', '', file_name, flags=re.IGNORECASE)
    
    clean_name = file_name.lower()
    clean_name = re.sub(r'[^a-z0-9\.\-]', '-', clean_name)
    clean_name = re.sub(r'-+', '-', clean_name)
    clean_name = re.sub(r'^-|-$', '', clean_name)
    
    return f"{clean_name}.{app_id}"

def html_to_clean_markdown(html_string):
    """Chuyển đổi HTML sang Markdown và làm sạch"""
    if not html_string:
        return ""
    
    md = html_string
    
    # Chuyển đổi các thẻ HTML cơ bản
    md = re.sub(r'<br\s*/?>', '\n', md, flags=re.IGNORECASE)
    md = re.sub(r'</div>\s*<div>', '\n', md, flags=re.IGNORECASE)
    md = re.sub(r'<div[^>]*>', '', md, flags=re.IGNORECASE)
    md = re.sub(r'</div>', '\n', md, flags=re.IGNORECASE)
    md = re.sub(r'<p[^>]*>', '', md, flags=re.IGNORECASE)
    md = re.sub(r'</p>', '\n\n', md, flags=re.IGNORECASE)
    
    # Chuyển đổi thẻ link <a href="link">Text</a> thành [Text](link)
    md = re.sub(r'<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', md, flags=re.IGNORECASE)
    
    # Loại bỏ các thẻ HTML còn sót lại
    md = re.sub(r'<[^>]*>', '', md)
    
    # Xử lý xuống dòng
    lines = md.split('\n')
    cleaned_lines = []
    prev_empty = False
    
    for line in lines:
        line = line.strip()
        if line:
            cleaned_lines.append(line)
            prev_empty = False
        elif not prev_empty:
            cleaned_lines.append('')
            prev_empty = True
    
    md = '\n'.join(cleaned_lines)
    
    return md.strip()

def get_all_apps():
    """Lấy toàn bộ danh sách app từ các trang"""
    all_apps = []
    page = 0
    
    while True:
        try:
            url = f"https://nestapi.flekstore.com/app?page={page}&search=&filter="
            print(f"Đang lấy danh sách từ page {page}...")
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list) and len(data) > 0:
                all_apps.extend(data)
                page += 1
                print(f"  -> Đã lấy {len(data)} apps, tổng: {len(all_apps)}")
            else:
                break
        except Exception as error:
            print(f"Lỗi khi lấy danh sách ở page {page}: {error}")
            break
    
    return all_apps

def transform_app_list(apps_array, progress_callback=None):
    """Chuyển đổi danh sách app sang cấu trúc mới"""
    final_mapped_apps = []
    total_apps = len(apps_array)
    
    for idx, minimal_app in enumerate(apps_array):
        app_id = minimal_app.get('id')
        
        try:
            # Lấy chi tiết từng app
            url = f"https://nestapi.flekstore.com/app/{app_id}"
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            detail_data = response.json()
            
            # Format ngày
            formatted_date = ""
            if detail_data.get('date'):
                formatted_date = detail_data['date'].split("T")[0]
            
            # Tạo download URL
            base_ipa_url = "https://s3-storage.flekstore.com/ipa-library/"
            install_url = detail_data.get('install_url', '')
            full_download_url = ""
            if install_url:
                if install_url.startswith('http'):
                    full_download_url = install_url
                else:
                    full_download_url = base_ipa_url + install_url
            
            # Tạo bundle ID
            computed_bundle_id = generate_bundle_id(install_url, app_id)
            
            # Làm sạch description
            clean_description = html_to_clean_markdown(detail_data.get('description', ''))
            
            # Mapping sang cấu trúc mới
            mapped_app = {
                "beta": "xxx" if detail_data.get('isAdult') else False,
                "name": detail_data.get('name', ''),
                "type": 1,
                "bundleIdentifier": computed_bundle_id,
                "developerName": detail_data.get('developer', ''),
                "subtitle": minimal_app.get('short_description', ''),
                "localizedDescription": clean_description,
                "versionDescription": clean_description,
                "tintColor": "5d594b",
                "iconURL": detail_data.get('icon', ''),
                "screenshotURLs": detail_data.get('photos', []),
                "screenshots": [],
                "appPermissions": {
                    "entitlements": [],
                    "privacy": {}
                },
                "size": detail_data.get('size', 0),
                "version": detail_data.get('version', ''),
                "versions": [
                    {
                        "version": detail_data.get('version', ''),
                        "date": formatted_date,
                        "size": detail_data.get('size', 0),
                        "downloadURL": full_download_url,
                        "localizedDescription": clean_description
                    }
                ],
                "versionDate": formatted_date,
                "downloadURL": full_download_url,
                "patreon": {}
            }
            
            final_mapped_apps.append(mapped_app)
            print(f"[{idx + 1}/{total_apps}] Đã xử lý: {detail_data.get('name')} -> {computed_bundle_id}")
            
        except Exception as error:
            print(f"Lỗi xử lý chi tiết app ID {app_id}: {error}")
            continue
        
        # Cập nhật tiến độ
        if progress_callback:
            progress = int((idx + 1) / total_apps * 100)
            progress_callback(progress)
        
        # In tiến độ
        if (idx + 1) % 10 == 0 or (idx + 1) == total_apps:
            print(f"📦 Đã xử lý {idx + 1}/{total_apps} ứng dụng...")
    
    return final_mapped_apps

def normalizeDateFormat(date_str):
    """Chuẩn hóa định dạng ngày tháng"""
    if not date_str:
        return "2025-01-01"
    
    # dd-mm-yyyy
    import re
    dmy_regex = r'^(\d{1,2})-(\d{1,2})-(\d{4})$'
    ymd_regex = r'^(\d{4})-(\d{1,2})-(\d{1,2})$'
    
    dmy_match = re.match(dmy_regex, date_str)
    if dmy_match:
        day, month, year = dmy_match.groups()
        return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
    
    ymd_match = re.match(ymd_regex, date_str)
    if ymd_match:
        year, month, day = ymd_match.groups()
        return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
    
    return date_str

def consolidateApps(source):
    """Sắp xếp lại dữ liệu apps"""
    uniqueAppsMap = {}
    
    for app in source.get('apps', []):
        bundleID = app.get('bundleIdentifier')
        
        # Tạo đối tượng phiên bản để gộp
        firstVersion = app.get('versions', [{}])[0] if app.get('versions') else {}
        appDate = normalizeDateFormat(app.get('versionDate') or firstVersion.get('date') or "2025-01-01")
        
        versionInfo = {
            'version': app.get('version') or firstVersion.get('version') or "1.0.0",
            'date': appDate,
            'size': app.get('size') or firstVersion.get('size') or 0,
            'downloadURL': app.get('downloadURL') or firstVersion.get('downloadURL') or "",
            'localizedDescription': app.get('localizedDescription') or firstVersion.get('localizedDescription') or ""
        }
        
        if bundleID in uniqueAppsMap:
            existingApp = uniqueAppsMap[bundleID]
            if appDate > existingApp['versionDate']:
                existingApp['versionDate'] = appDate
                existingApp['version'] = app.get('version') or firstVersion.get('version') or "1.0.0"
                existingApp['downloadURL'] = app.get('downloadURL') or firstVersion.get('downloadURL') or ""
                existingApp['size'] = app.get('size') or firstVersion.get('size') or 0
                existingApp['localizedDescription'] = app.get('localizedDescription') or ""
            existingApp['versions'].append(versionInfo)
        else:
            # Trường hợp duy nhất: Tạo đối tượng mới
            newApp = {
                'beta': app.get('beta', False),
                'name': app.get('name'),
                'type': app.get('type', 1),
                'bundleIdentifier': app.get('bundleIdentifier'),
                'developerName': app.get('developerName', ""),
                'subtitle': app.get('subtitle', ""),
                'localizedDescription': app.get('localizedDescription') or "Lưu trữ IPA",
                'versionDescription': app.get('versionDescription', ""),
                'tintColor': app.get('tintColor') or "00adef",
                'iconURL': app.get('iconURL') or "./common/assets/img/generic_app.jpeg",
                'screenshotURLs': app.get('screenshotURLs', []),
                'screenshots': app.get('screenshots', []),
                'appPermissions': app.get('appPermissions', {
                    'entitlements': [],
                    'privacy': {}
                }),
                'size': app.get('size') or firstVersion.get('size') or 0,
                'version': app.get('version') or firstVersion.get('version') or "1.0.0",
                'versions': app.get('versions', [versionInfo]),
                'versionDate': appDate,
                'downloadURL': app.get('downloadURL') or firstVersion.get('downloadURL') or "",
                'patreon': app.get('patreon', {}),
                'download_page_url': app.get('download_page_url', "")
            }
            uniqueAppsMap[bundleID] = newApp
    
    # Giới hạn tối đa 20 versions
    consolidatedApps = list(uniqueAppsMap.values())
    MAX_VERSIONS = 5
    for app in consolidatedApps:
        if len(app['versions']) > MAX_VERSIONS:
            app['versions'] = app['versions'][:MAX_VERSIONS]
    
    newSource = {
        **source,
        'apps': consolidatedApps
    }
    
    # Thêm META nếu chưa có
    if 'META' not in newSource:
        newSource['META'] = {
            'repoName': newSource.get('name'),
            'repoIcon': newSource.get('iconURL')
        }
    
    # Thêm các trường bổ sung
    if 'sourceImage' not in newSource:
        newSource['sourceImage'] = newSource.get('iconURL')
    
    if 'sourceURL' not in newSource:
        newSource['sourceURL'] = "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/"
    
    return newSource

def transform_data(old_data):
    """Chuyển đổi dữ liệu sang định dạng AltStore"""
    new_data = {
        "name": old_data.get("name"),
        "identifier": old_data.get("identifier"),
        "sourceURL": old_data.get("sourceURL", "").replace('.json', '.altstore.json'),
        "iconURL": old_data.get("iconURL"),
        "website": old_data.get("website"),
        "ipawebsite": "https://kho-ipa.vercel.app",
        "subtitle": old_data.get("subtitle"),
        "apps": []
    }
    
    if old_data.get("apps") and isinstance(old_data["apps"], list):
        for app in old_data["apps"]:
            v_date = "2026-05-31"
            f_date = "20260531140000"
            
            if app.get("versionDate"):
                try:
                    # Parse ngày tháng
                    date_obj = datetime.fromisoformat(app["versionDate"].replace('Z', '+00:00'))
                    v_date = date_obj.strftime("%Y-%m-%d")
                    f_date = date_obj.strftime("%Y%m%d%H%M%S")
                except:
                    print(f"Lỗi ngày tháng tại ứng dụng: {app.get('name')}")
            
            new_data["apps"].append({
                "name": app.get("name", ""),
                "type": app.get("type", 1),
                "bundleID": app.get("bundleIdentifier", ""),
                "bundleIdentifier": app.get("bundleIdentifier", ""),
                "version": app.get("version", ""),
                "versionDate": v_date,
                "fullDate": f_date,
                "size": app.get("size", 0),
                "down": app.get("downloadURL", ""),
                "downloadURL": app.get("downloadURL", ""),
                "developerName": app.get("developerName", ""),
                "localizedDescription": app.get("localizedDescription", ""),
                "icon": app.get("iconURL", ""),
                "iconURL": app.get("iconURL", "")
            })
    
    return new_data

def save_json_file(data, filepath):
    """Lưu dữ liệu JSON vào file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    print(f"Đã lưu file: {filepath}")

def start_crawling(output_dir="../upload/"):
    """Hàm chạy chính"""
    
    # Tạo thư mục nếu chưa tồn tại
    os.makedirs(output_dir, exist_ok=True)
    
    # Khởi tạo repo structure
    repo = {
        "name": "FlekStore Repo",
        "identifier": "ios.flekstore.repo",
        "sourceURL": "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/repo.flekstore.json",
        "iconURL": "https://flekstore.com/pro_app/icons/apple-touch-icon.png",
        "website": "https://flekstore.com/pro_app/",
        "ipawebsite": "https://kho-ipa.vercel.app",
        "subtitle": "Install any iOS app no cables, no PC, no Jailbreak",
        "tintColor": "5d594b",
        "apps": []
    }
    
    def update_progress(progress):
        print(f"Tiến độ: {progress}%")
    
    print("🚀 Bắt đầu quét danh sách tất cả các app...")
    raw_app_list = get_all_apps()
    print(f"📦 Tìm thấy tổng cộng {len(raw_app_list)} apps.")
    
    print("⏳ Bắt đầu lấy chi tiết và chuyển đổi cấu trúc dữ liệu...")
    final_result = transform_app_list(raw_app_list, update_progress)
    
    repo["apps"] = final_result
    print("✅ HOÀN THÀNH VÀ GỘP MẢNG THÀNH CÔNG!")
    
    # Lưu file repo.flekstore.json
    output_file1 = os.path.join(output_dir, "repo.flekstore.json")
    consolidated_repo = consolidateApps(repo)
    save_json_file(consolidated_repo, output_file1)
    
    # Chuyển đổi sang định dạng AltStore
    print("🔄 Đang chuyển đổi sang định dạng AltStore...")
    altstore_data = transform_data(consolidated_repo)
    
    # Lưu file repo.flekstore.altstore.json
    output_file2 = os.path.join(output_dir, "repo.flekstore.altstore.json")
    save_json_file(altstore_data, output_file2)
    
    print(f"\n✅ HOÀN TẤT! Đã lưu 2 file vào thư mục {output_dir}")
    print(f"   - {output_file1}")
    print(f"   - {output_file2}")
    
    return repo, altstore_data

if __name__ == "__main__":
    # Có thể thay đổi đường dẫn output ở đây
    OUTPUT_DIR = "../upload/"  # Thư mục lưu file
    
    # Hoặc sử dụng đường dẫn tuyệt đối
    # OUTPUT_DIR = "/Kho/upload/"
    
    start_crawling(OUTPUT_DIR)