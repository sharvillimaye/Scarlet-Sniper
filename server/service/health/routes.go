package health

import (
	"github.com/gorilla/mux"
	"github.com/sharvillimaye/scarlet-sniper/server/utils"
	"net/http"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if err := utils.WriteJSON(w, http.StatusOK, nil); err != nil {
			panic(err)
		}
	}).Methods("GET")
}
