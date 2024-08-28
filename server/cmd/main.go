package main

import (
	"log"

	"github.com/go-sql-driver/mysql"
	"github.com/sharvillimaye/scarlet-sniper/server/cmd/api"
	"github.com/sharvillimaye/scarlet-sniper/server/db"
)

func main() {
	db := db.NewMySQLStorage(mysql.Config{
		
	})
	server := api.NewAPIServer(":8080", nil)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}