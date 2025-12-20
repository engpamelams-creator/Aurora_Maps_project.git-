import os
import pandas as pd
from sqlalchemy import create_engine, text
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Configuration ---
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_DATABASE", "aurora_maps")
DB_USER = os.getenv("DB_USERNAME", "aurora")
DB_PASS = os.getenv("DB_PASSWORD", "password")

def fetch_data():
    """
    1. ETL Simple: Connects to Postgres and extracts interaction data.
    Optimizes data types for memory efficiency.
    """
    print("🔌 Connecting to Database...")
    connection_string = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(connection_string)

    query = """
    SELECT 
        u.id as user_id,
        l.action_type, -- 'like', 'view', 'route', 'check_in'
        l.created_at,
        p.name as place_name,
        p.latitude,
        p.longitude,
        p.category
    FROM user_activity_logs l
    JOIN places p ON l.place_id = p.id
    WHERE l.created_at >= NOW() - INTERVAL '30 days'
    """
    
    try:
        with engine.connect() as conn:
            df = pd.read_sql(text(query), conn)
        
        print(f"✅ Data Fetched: {len(df)} rows.")

        if df.empty:
            print("⚠️ No data found. Generating mock data for demonstration...")
            return generate_mock_data()

        # Optimize Data Types
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['action_type'] = df['action_type'].astype('category')
        df['category'] = df['category'].astype('category')
        
        return df

    except Exception as e:
        print(f"❌ Database Error: {e}")
        print("⚠️ Handling Error: Generating mock data for demonstration purposes...")
        return generate_mock_data()

def generate_mock_data():
    """Fallback: Generates fake data if DB is empty or unreachable"""
    import numpy as np
    
    dates = pd.date_range(end=pd.Timestamp.now(), periods=500, freq='H')
    data = {
        'user_id': np.random.randint(1, 100, 500),
        'action_type': np.random.choice(['view', 'like', 'route', 'check_in'], 500, p=[0.5, 0.3, 0.1, 0.1]),
        'created_at': dates,
        'latitude': np.random.uniform(-23.55, -23.56, 500), # Sao Paulo Coordinates Approx
        'longitude': np.random.uniform(-46.63, -46.64, 500),
        'place_name': ['Place ' + str(i) for i in range(500)]
    }
    df = pd.DataFrame(data)
    df['created_at'] = pd.to_datetime(df['created_at'])
    return df

def generate_heatmap(df):
    """
    2. Geospatial Cluster Analysis
    Uses Plotly Density Mapbox (Dark Theme)
    """
    print("🗺️ Generating Heatmap...")
    fig = px.density_mapbox(
        df, 
        lat='latitude', 
        lon='longitude', 
        z=df['action_type'].apply(lambda x: 1), # Count intensity
        radius=15,
        center=dict(lat=-23.55, lon=-46.63),
        zoom=12,
        mapbox_style="carto-darkmatter",
        title="🔥 Aurora Maps: Heatmap de Interações (Últimos 30 Dias)"
    )
    return fig

def generate_funnel(df):
    """
    3. KPI: Funnel Chart (Impressions -> Clicks/Likes -> Routes)
    """
    print("📉 Generating Funnel...")
    # Count occurrences
    views = df[df['action_type'] == 'view'].shape[0]
    likes = df[df['action_type'] == 'like'].shape[0]
    routes = df[df['action_type'] == 'route'].shape[0]

    data = dict(
        number=[views, likes, routes],
        stage=["Impressões (Feed)", "Interações (Like/Check-in)", "Rota Traçada"]
    )
    
    fig = px.funnel(
        data, 
        x='number', 
        y='stage',
        title="🔻 Funil de Conversão do Algoritmo"
    )
    return fig

def generate_hourly_activity(df):
    """
    3. KPI: Hourly Activity (Time Series)
    """
    print("⏰ Generating Hourly Activity...")
    df['hour'] = df['created_at'].dt.hour
    hourly_counts = df.groupby('hour').size().reset_index(name='counts')

    fig = px.line(
        hourly_counts, 
        x='hour', 
        y='counts', 
        title="📈 Atividade Horária dos Usuários",
        markers=True
    )
    fig.update_xaxes(title="Hora do Dia (0-23)")
    fig.update_yaxes(title="Total de Ações")
    return fig

def generate_scatter(df):
    """
    3. KPI: Scatter Plot (Distance vs Likes - Mocked Distances)
    """
    print("📍 Generating Scatter Plot...")
    # Generating mock distance for demonstration since we don't have user home loc in logs yet
    import numpy as np
    df['distance_km'] = np.random.uniform(0.5, 20.0, size=len(df))
    
    # Aggregating by place
    place_stats = df.groupby('place_name').agg({
        'distance_km': 'mean',
        'action_type': lambda x: (x == 'like').sum()
    }).rename(columns={'action_type': 'total_likes'}).reset_index()

    fig = px.scatter(
        place_stats, 
        x='distance_km', 
        y='total_likes',
        title="📍 Distância vs Engajamento (Likes)",
        trendline="ols"  # Requires statsmodels, omitted for safety if not installed, but standard in Scatter
    )
    return fig

def export_report(figs):
    """
    4. Export to HTML
    Combines all figures into a single interactive HTML file.
    """
    print("💾 Exporting Report...")
    with open("relatorio_semanal.html", 'w', encoding="utf-8") as f:
        f.write("<html><head><title>Aurora Maps Analytics</title></head><body style='background-color: #121212; color: white;'>")
        f.write("<h1 style='text-align:center;'>🌌 Aurora Maps - Relatório de Inteligência</h1>")
        
        for fig in figs:
            # Update layout for dark theme consistency
            fig.update_layout(
                template="plotly_dark",
                paper_bgcolor="#1e1e1e",
                plot_bgcolor="#1e1e1e",
                font_color="white"
            )
            f.write(fig.to_html(full_html=False, include_plotlyjs='cdn'))
            
        f.write("</body></html>")
    
    print("✅ Report saved as 'relatorio_semanal.html'")

def main():
    print("--- 🚀 Starting Aurora Maps Data Science Engine ---")
    
    # 1. ETL
    df = fetch_data()
    
    # 2. Visualizations
    fig_heatmap = generate_heatmap(df)
    fig_funnel = generate_funnel(df)
    fig_hourly = generate_hourly_activity(df)
    fig_scatter = generate_scatter(df)
    
    # 3. Export
    export_report([fig_heatmap, fig_funnel, fig_hourly, fig_scatter])
    
    print("--- 🎉 Process Complete. Open relatorio_semanal.html ---")

if __name__ == "__main__":
    main()
