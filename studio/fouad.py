import json
import requests
from datetime import datetime
import os  # Thêm thư viện os để làm việc với đường dẫn

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
    
    # Giới hạn tối đa 5 versions
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

def main():
    # URL cần lấy dữ liệu
    url = "https://altstore.fouadraheb.com/"
    
    # Định nghĩa đường dẫn output
    output_dir = "../upload/"  # Thư mục đích
    output_file = "fouadraheb.json"
    
    # Tạo đường dẫn đầy đủ
    full_path = os.path.join(output_dir, output_file)
    
    # Tạo thư mục nếu chưa tồn tại
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Lấy dữ liệu từ URL
        print(f"Đang lấy dữ liệu từ {url}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()  # Kiểm tra lỗi HTTP
        
        # Parse JSON data
        source_data = response.json()
        print("Đã lấy dữ liệu thành công!")
        
        # Áp dụng hàm consolidateApps
        print("Đang xử lý dữ liệu...")
        consolidated_data = consolidateApps(source_data)
        
        # Lưu vào file
        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(consolidated_data, f, ensure_ascii=False, indent=2)
        
        print(f"Đã lưu dữ liệu vào file {full_path}")
        print(f"Tổng số apps sau khi xử lý: {len(consolidated_data.get('apps', []))}")
        
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi lấy dữ liệu từ URL: {e}")
    except json.JSONDecodeError as e:
        print(f"Lỗi khi parse JSON: {e}")
    except Exception as e:
        print(f"Lỗi không xác định: {e}")

if __name__ == "__main__":
    main()