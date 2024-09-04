package user

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sharvillimaye/scarlet-sniper/server/config"
	"github.com/sharvillimaye/scarlet-sniper/server/service/auth"
	"github.com/sharvillimaye/scarlet-sniper/server/types"
	"github.com/sharvillimaye/scarlet-sniper/server/utils"
)

type Handler struct {
	store types.UserStore
}

func NewHandler(store types.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/login", h.handleLogin).Methods("POST")
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
	router.HandleFunc("/user", auth.WithJWTAuth(h.handleUser, h.store)).Methods("GET")
}

func (h *Handler) handleUser(w http.ResponseWriter, r *http.Request) {
	userID := auth.GetUserIDFromContext(r.Context())

	user, err := h.store.GetUserByID(userID)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("failed to get user by id: %v", err))
	}

	if err = utils.WriteJSON(w, http.StatusOK, map[string]string{"username": user.Username, "email": user.Email}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var user types.LoginUserPayload
	if err := utils.ParseJSON(r, &user); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(user); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	u, err := h.store.GetUserByEmail(user.Email)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("not found, invalid email or password"))
		return
	}

	if !auth.ComparePasswords(u.Password, []byte(user.Password)) {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("not found, invalid email or password"))
		return
	}

	secret := []byte(config.Envs.JWTSecret)
	token, err := auth.CreateJWT(secret, u.ID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if err = utils.WriteJSON(w, http.StatusOK, map[string]string{"username": u.Username, "email": u.Email, "token": token}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload %v", errors))
		return
	}

	_, err := h.store.GetUserByEmail(payload.Email)
	if err == nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("user with email %s already exists", payload.Email))
		return
	}

	hashedPassword, err := auth.HashPassword(payload.Password)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	err = h.store.CreateUser(types.User{
		Email:    payload.Email,
		Username: payload.Username,
		Password: hashedPassword,
	})
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if err = utils.WriteJSON(w, http.StatusCreated, map[string]string{"username": payload.Username, "email": payload.Email}); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}
