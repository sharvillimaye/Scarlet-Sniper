package types

import "time"

type RegisterUserPayload struct {
	Username string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UserStore interface {
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(User) error
}

type User struct {
	ID int `json:"id"`
	Email string `json:"email"`
	Username string `json:"username"`
	Password string `json:"-"`
	CreatedAt time.Time `json:"createdAt"`
}