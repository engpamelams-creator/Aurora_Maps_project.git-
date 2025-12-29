<?php
try {
    $pdo = new PDO('pgsql:host=db;port=5432;dbname=aurora_maps', 'user', 'password');
    echo "Connected successfully to Database\n";
    // Check if tables exist
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables: " . implode(", ", $tables) . "\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
