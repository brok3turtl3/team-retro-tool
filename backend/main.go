package main

import (
	"context"
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
    ID   int `json:"id"`
    Name string `json:"name"`
}

type Card struct {
    ID         int `json:"id"`
    Content    string `json:"content"`
    CategoryID int `json:"categoryId"`
}

type User struct {
    Email    string `json:"email"`
    Password string `json:"password"`
    Role     string `json:"role"`
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

func getCards(w http.ResponseWriter, r *http.Request) {
    var cards []Card
    err := supabaseClient.DB.From("cards").Select("*").Execute(&cards)
    if err != nil {
        log.Printf("Error fetching cards: %v", err)
        http.Error(w, "Failed to fetch cards", http.StatusInternalServerError)
        return
    }
    log.Printf("Fetched cards: %v", cards)
    json.NewEncoder(w).Encode(cards)
}

func registerUser(w http.ResponseWriter, r *http.Request) {
    var input User
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    credentials := supabase.UserCredentials{
        Email:    input.Email,
        Password: input.Password,
    }

    user, err := supabaseClient.Auth.SignUp(context.Background(), credentials)
    if err != nil {
        log.Printf("Error registering user: %v", err)
        http.Error(w, "Registration failed", http.StatusInternalServerError)
        return
    }

    var result []map[string]interface{}
    dbErr := supabaseClient.DB.From("users").Insert(map[string]interface{}{
        "id":    user.ID,
        "email": input.Email,
        "role":  "User",
    }).Execute(&result)
    if dbErr != nil {
        log.Printf("Error saving user role: %v", dbErr)
        http.Error(w, "Failed to save user role", http.StatusInternalServerError)
        return
    }

    response := map[string]interface{}{
        "id":    user.ID,
        "email": input.Email,
        "role":  "User",
    }

    log.Printf("Registered user: %v", input.Email)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(response)
}

func loginUser(w http.ResponseWriter, r *http.Request) {
    var input User
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid input", http.StatusBadRequest)
        return
    }

    log.Printf("Attempting login for user: %v", input.Email)

    credentials := supabase.UserCredentials{
        Email:    input.Email,
        Password: input.Password,
    }

    session, err := supabaseClient.Auth.SignIn(context.Background(), credentials)
    if err != nil {
        log.Printf("Error logging in user: %v", err)
        http.Error(w, "Login failed", http.StatusUnauthorized)
        return
    }

    response := map[string]interface{}{
        "access_token": session.AccessToken,
        "user": map[string]string{
            "id": session.User.ID,
            "email": session.User.Email,
            "role": "User",
        },
    }
    log.Printf("User logged in: %v", input.Email)
    json.NewEncoder(w).Encode(response)
}

func getUser(w http.ResponseWriter, r *http.Request) {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
        return
    }

    user, err := supabaseClient.Auth.User(context.Background(), authHeader)
    if err != nil {
        log.Printf("Error verifying user: %v", err)
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    var dbUsers []User
    err = supabaseClient.DB.From("users").Select("*").Eq("id", user.ID).Execute(&dbUsers)
    if err != nil || len(dbUsers) == 0{
        log.Printf("Error fetching user details: %v", err)
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    if len(dbUsers) > 1 {
        log.Printf("Error: multiple users found with the same ID")
        http.Error(w, "Multiple users found", http.StatusInternalServerError)
        return
    }

    dbUser := dbUsers[0]
    json.NewEncoder(w).Encode(dbUser)
}




func main() {
    r := mux.NewRouter()

    r.HandleFunc("/categories", getCategories).Methods("GET")
	r.HandleFunc("/cards", getCards).Methods("GET")

    r.HandleFunc("/register", registerUser).Methods("POST")
    r.HandleFunc("/login", loginUser).Methods("POST")
    r.HandleFunc("/user", getUser).Methods("GET")


	corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"http://localhost:4200"}),
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
    )

    log.Println("Server running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", corsHandler(r)))
}
