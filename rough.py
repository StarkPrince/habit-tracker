import json

def load_json(filename):
    """ Load a JSON file and return its data. """
    with open(filename, 'r') as file:
        return json.load(file)

def save_json(data, filename):
    """ Save a Python dictionary to a JSON file. """
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

def update_country_names(geojson_data, map_countries, enum_countries):
    """ Update GeoJSON data based on a list of standard country names. """
    country_updates = 0
    enum_dict = {country: True for country in enum_countries}
    for feature in geojson_data['features']:
        country_name = feature['properties']['name']
        if country_name not in enum_dict:
            similar_name = find_similar_name(country_name, enum_countries)
            if similar_name:
                print(f"Renaming {country_name} to {similar_name}")
                feature['properties']['name'] = similar_name
                country_updates += 1
    print(f"Total updates made: {country_updates}")
    return geojson_data

def find_similar_name(name, enum_list):
    """ Find a similar name in the enum list to account for minor differences. """
    for enum_name in enum_list:
        if name.replace(" ", "").lower() in enum_name.replace(" ", "").lower():
            return enum_name
    return None

def remove_duplicates_from_lists(list1, list2):
    """ Remove duplicates from both lists after updates. """
    set1, set2 = set(list1), set(list2)
    common_elements = set1.intersection(set2)
    # Return lists without the common elements
    return list(set1 - common_elements), list(set2 - common_elements)

def main():
    geojson_filename = r'C:\\Codes\\web_again\\habit-tracker\\src\\public\\world-countries.json'
    json_filename = r'C:\\Codes\\web_again\\habit-tracker\\countries.json'
    
    # Load data from files
    geojson_data = load_json(geojson_filename)
    countries_data = load_json(json_filename)
    map_countries = countries_data['map_countries']
    enum_countries = countries_data['enum_countries']

    # Update the GeoJSON file
    updated_geojson_data = update_country_names(geojson_data, map_countries, enum_countries)
    
    # Save updated GeoJSON data
    save_json(updated_geojson_data, geojson_filename)
    
    # Remove duplicates from both lists
    updated_map_countries, updated_enum_countries = remove_duplicates_from_lists(map_countries, enum_countries)
    
    # Save updated lists to the countries.json file
    countries_data['map_countries'] = updated_map_countries
    countries_data['enum_countries'] = updated_enum_countries
    save_json(countries_data, json_filename)

if __name__ == "__main__":
    main()
