import json
import numpy as np
import pandas as pd
import os

# Configuration
OUTPUT_FILE = 'public/data.json'
COUNT = 50

def generate_data():
    """Generates athlete data based on user specifications."""
    np.random.seed(42)
    
    n_athletes = COUNT
    
    # User provided logic
    data_dict = {
        'athlete_id': range(1, n_athletes + 1),
        'name': [f"Athlete_{i}" for i in range(1, n_athletes + 1)],
        'max_pullups': np.random.randint(5, 45, size=n_athletes),
        'max_muscleups': np.random.randint(0, 15, size=n_athletes),
        'strength_score': np.random.uniform(10, 100, size=n_athletes),
        'category': np.random.choice(['Beginner', 'Intermediate', 'Elite'], size=n_athletes)
    }
    
    df = pd.DataFrame(data_dict)
    
    # Transformation for 3D Scene
    export_data = []
    
    # Iterating over DataFrame rows properly
    for index, row in df.iterrows():
        # X Axis: Pullups (Spread out)
        # 5 to 45 -> Center around 0. (Val - 25). Spread factor 1.5
        x = (row['max_pullups'] - 25) * 1.5
        
        # Z Axis: Muscleups (Spread out)
        # 0 to 15 -> Center around 0. (Val - 7.5). Spread factor 3 (since range is smaller)
        z = (row['max_muscleups'] - 7.5) * 4
        
        # Y Axis Value: Strength Score (10-100) -> Normalized 0-1
        normalized_value = (row['strength_score'] - 10) / 90
        
        item = {
            "id": int(row['athlete_id']),
            "label": row['name'],
            "value": float(normalized_value),
            "raw_value": round(row['strength_score'], 1),
            "category": row['category'],
            "stats": {
                "pullups": int(row['max_pullups']),
                "muscleups": int(row['max_muscleups'])
            },
            "position": [float(x), 0, float(z)]
        }
        export_data.append(item)
        
    return export_data, df

def main():
    if not os.path.exists('public'):
        os.makedirs('public')
        
    json_data, df = generate_data()
    
    # Save JSON for frontend
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(json_data, f, indent=2)
        
    # Save CSV as requested by user
    df.to_csv('public/calisthenics_data.csv', index=False)
        
    print(f"✅ Generated {COUNT} athletes to {OUTPUT_FILE}")
    print(f"✅ Saved CSV to public/calisthenics_data.csv")
    print("Example Data Point:", json.dumps(json_data[0], indent=2))

if __name__ == '__main__':
    main()
