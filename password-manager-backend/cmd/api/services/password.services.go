package services

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword recibe una contraseña en texto plano y devuelve su hash
func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// CheckPassword compara la contraseña en texto plano con el hash
func CheckPassword(password string, hashed string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
	return err == nil
}
