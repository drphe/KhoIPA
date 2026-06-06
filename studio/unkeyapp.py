import json
import requests
import os
import math
from datetime import datetime
import time

def normalize_date_format(date_str):
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

def consolidate_apps(source):
    """Sắp xếp lại dữ liệu apps"""
    unique_apps_map = {}
    
    for app in source.get('apps', []):
        bundle_id = app.get('bundleIdentifier')
        
        # Tạo đối tượng phiên bản để gộp
        first_version = app.get('versions', [{}])[0] if app.get('versions') else {}
        app_date = normalize_date_format(app.get('versionDate') or first_version.get('date') or "2025-01-01")
        
        version_info = {
            'version': app.get('version') or first_version.get('version') or "1.0.0",
            'date': app_date,
            'size': app.get('size') or first_version.get('size') or 0,
            'downloadURL': app.get('downloadURL') or first_version.get('downloadURL') or "",
            'localizedDescription': app.get('localizedDescription') or first_version.get('localizedDescription') or ""
        }
        
        if bundle_id in unique_apps_map:
            existing_app = unique_apps_map[bundle_id]
            if app_date > existing_app['versionDate']:
                existing_app['versionDate'] = app_date
                existing_app['version'] = app.get('version') or first_version.get('version') or "1.0.0"
                existing_app['downloadURL'] = app.get('downloadURL') or first_version.get('downloadURL') or ""
                existing_app['size'] = app.get('size') or first_version.get('size') or 0
                existing_app['localizedDescription'] = app.get('localizedDescription') or ""
            existing_app['versions'].append(version_info)
        else:
            # Tạo đối tượng mới
            new_app = {
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
                'size': app.get('size') or first_version.get('size') or 0,
                'version': app.get('version') or first_version.get('version') or "1.0.0",
                'versions': app.get('versions', [version_info]),
                'versionDate': app_date,
                'downloadURL': app.get('downloadURL') or first_version.get('downloadURL') or "",
                'patreon': app.get('patreon', {}),
                'download_page_url': app.get('download_page_url', "")
            }
            unique_apps_map[bundle_id] = new_app
    
    # Giới hạn tối đa 5 versions
    consolidated_apps = list(unique_apps_map.values())
    MAX_VERSIONS = 5
    for app in consolidated_apps:
        if len(app['versions']) > MAX_VERSIONS:
            app['versions'] = app['versions'][:MAX_VERSIONS]
    
    new_source = {
        **source,
        'apps': consolidated_apps
    }
    
    # Thêm META nếu chưa có
    if 'META' not in new_source:
        new_source['META'] = {
            'repoName': new_source.get('name'),
            'repoIcon': new_source.get('iconURL')
        }
    
    # Thêm các trường bổ sung
    if 'sourceImage' not in new_source:
        new_source['sourceImage'] = new_source.get('iconURL')
    
    if 'sourceURL' not in new_source:
        new_source['sourceURL'] = "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/"
    
    return new_source

def convert_app_structure(source_app):
    """Chuyển đổi cấu trúc app từ API sang format mới"""
    genre_order = [
        ["Games", 2],
        ["Music", 3],
        ["Utilities", 4]
    ]
    
    # Xử lý ngày tháng
    updated_at = source_app.get('updatedAt')
    version_date = ""
    if updated_at:
        try:
            # Parse ISO format
            dt = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
            version_date = dt.strftime("%Y-%m-%d")
        except:
            version_date = "2025-01-01"
    else:
        version_date = "2025-01-01"
    
    # Xác định type dựa trên genres
    app_type = 1  # Giá trị mặc định
    genres = source_app.get('genres', [])
    for genre_name, genre_type in genre_order:
        if genre_name in genres:
            app_type = genre_type
            break
    
    return {
        "beta": False,
        "name": source_app.get('name', ''),
        "type": app_type,
        "bundleIdentifier": source_app.get('bundlerId', ''),
        "version": source_app.get('version', ''),
        "size": source_app.get('fileSize', 0),
        "downloadURL": source_app.get('ipaLink', ''),
        "iconURL": source_app.get('logo', ''),
        "versionDate": version_date,
        "tintColor": "0cabeb",
        "screenshotURLs": source_app.get('screenshots', []),
        "localizedDescription": source_app.get('addDescription') or "Lưu trữ IPA",
        "developerName": "Unkeyapp",
        "subtitle": source_app.get('addDescription') or "",
    }

def fetch_and_process_apps(page, page_size, session):
    """Lấy và xử lý apps từ API"""
    base_url = '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x61\x70\x69\x2e\x75\x6e\x6b\x65\x79\x61\x70\x70\x2e\x63\x6f\x6d\x2f\x76\x31\x2f\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e'
    url = f"{base_url}?page={page}&pageSize={page_size}"
    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        json_response = response.json()
        
        if (json_response.get('code') != 200 or 
            not json_response.get('data') or 
            not isinstance(json_response['data'].get('data'), list)):
            print(f"  Dữ liệu API không hợp lệ ở page {page}")
            return []
        
        app_data_list = json_response['data']['data']
        converted_apps = []
        
        for app in app_data_list:
            if app.get('bundlerId') and app.get('ipaLink'):
                converted_apps.append(convert_app_structure(app))
        
        return converted_apps
        
    except Exception as error:
        print(f"  Lỗi khi lấy dữ liệu ở page {page}: {error}")
        return []

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
                    date_obj = datetime.strptime(app["versionDate"], "%Y-%m-%d")
                    v_date = date_obj.strftime("%Y-%m-%d")
                    f_date = date_obj.strftime("%Y%m%d") + "140000"  # Giờ mặc định 14:00:00
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

def save_json_file(data, filepath, minify=False):
    """Lưu dữ liệu JSON vào file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        if minify:
            # Lưu dạng 1 dòng, không khoảng trắng thừa
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        else:
            # Lưu dạng đẹp, có indent
            json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Đã lưu file: {filepath}")

def crawl_data(output_dir="../upload/"):
    """Hàm crawl chính"""
    
    # Khởi tạo dữ liệu JSON
    json_data = {
        "name": "Unkeyapp Store",
        "identifier": "com.unkeyapp.store",
        "subtitle": "Unkeyapp – kho ứng dụng bên thứ ba",
        "description": "Unkeyapp - Kho ứng dụng bên thứ ba.",
        "iconURL": "https://i.ibb.co/chdc4gB1/d07036ead96f.png",
        "website": "https://www.unkeyapp.com/app-store",
        "sourceURL": "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/repo.unkeyapp.json",
        "tintColor": "0cabeb",
        "featuredApps": [],
        "apps": [],
        "news": [{
            "title": "Welcome to Unkeyapp Store Repo!",
            "identifier": "unkeyapp.public.init",
            "caption": "Tap to open our App Store",
            "date": "2025-11-20",
            "tintColor": "#0cabeb",
            "imageURL": "https://i.ibb.co/hFypCsBL/1750296767052-IMG-5587.jpg",
            "notify": True,
            "url": "https://www.unkeyapp.com/app-store",
            "appID": None
        }]
    }
    
    # Tạo thư mục nếu chưa tồn tại
    os.makedirs(output_dir, exist_ok=True)
    
    # Cấu hình crawl
    page_size = 300
    total = 10000
    total_page = math.ceil(total / page_size)
    
    print("🚀 Bắt đầu lấy danh sách app từ Unkeyapp API...")
    print(f"📊 Dự kiến {total_page} lệnh get...")
    
    success_count = 0
    processed_count = 0
    
    # Tạo session để tái sử dụng kết nối
    session = requests.Session()
    
    for page in range(1, total_page + 1):
        try:
            print(f"\n📥 Đang xử lý page {page}/{total_page}...")
            converted_apps = fetch_and_process_apps(page, page_size, session)
            
            if converted_apps:
                json_data['apps'].extend(converted_apps)
                success_count += 1
                print(f"  ✅ Đã thêm {len(converted_apps)} apps. Tổng: {len(json_data['apps'])}")
            else:
                print(f"  ⚠️ Không có dữ liệu ở page {page}")
            
            processed_count += 1
            
        except Exception as e:
            print(f"  ❌ Lỗi ở page {page}: {e}")
        
        print(f"📦 Đã xử lý {processed_count}/{total_page} lệnh get...")
        
        # Delay nhẹ để tránh rate limit
        time.sleep(0.5)
    
    print(f"\n✅ Đã lấy thành công {len(json_data['apps'])} ứng dụng.")
    
    # Áp dụng hàm consolidateApps
    print("🔄 Đang consolidate dữ liệu...")
    consolidated_data = consolidate_apps(json_data)
    
    # Lưu file repo.unkeyapp.json (minified)
    output_file1 = os.path.join(output_dir, "repo.unkeyapp.json")
    save_json_file(consolidated_data, output_file1, minify=True)
    
    # Chuyển đổi sang định dạng AltStore
    print("🔄 Đang chuyển đổi sang định dạng AltStore...")
    altstore_data = transform_data(consolidated_data)
    
    # Lưu file repo.unkeyapp.altstore.json (minified)
    output_file2 = os.path.join(output_dir, "repo.unkeyapp.altstore.json")
    save_json_file(altstore_data, output_file2, minify=True)
    
    print(f"\n✅ HOÀN TẤT! Đã lưu 2 file vào thư mục {output_dir}")
    print(f"   📄 {output_file1}")
    print(f"   📄 {output_file2}")
    print(f"   📊 Tổng số apps: {len(consolidated_data.get('apps', []))}")
    
    return consolidated_data, altstore_data

if __name__ == "__main__":
    # Có thể thay đổi đường dẫn output ở đây
    OUTPUT_DIR = "../upload/"  # Thư mục lưu file
   
    crawl_data(OUTPUT_DIR)