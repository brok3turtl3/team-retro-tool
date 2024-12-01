package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/nedpals/supabase-go"
)

func init() {
    err := godotenv.Load(".env")
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
	log.Println("Supabase URL:", os.Getenv("SUPABASE_URL"))
    log.Println("Supabase Anon Key:", os.Getenv("SUPABASE_ANON_KEY"))
}

var supabaseClient = supabase.CreateClient(

	// TODO Fix the hardcoding with .env imports
	"https://yujmlplksifahxfxwqdn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1am1scGxrc2lmYWh4Znh3cWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzEyOTgsImV4cCI6MjA0ODY0NzI5OH0.8e9bzryM8UUevPvFkl2m1ZOwdYUQrdxfzl2fUHsc1P0",
)

type Category struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

func getCategories(w http.ResponseWriter, r *http.Request) {
    var categories []Category
    err := supabaseClient.DB.From("categories").Select("*").Execute(&categories)
    if err != nil {
		log.Printf("Error fetching categories: %v", err)
        http.Error(w, "Failed to fetch categories", http.StatusInternalServerError)
        return
    }
	log.Printf("Fetched categories: %v", categories)
    json.NewEncoder(w).Encode(categories)
}

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/categories", getCategories).Methods("GET")

	corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"http://localhost:4200"}), // Allow Angular frontend
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}), // Allow HTTP methods
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}), // Allow headers
    )

    log.Println("Server running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", corsHandler(r)))
}
