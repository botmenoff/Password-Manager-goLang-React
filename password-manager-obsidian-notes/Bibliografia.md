https://go.dev/doc/
https://www.youtube.com/watch?v=1ZbQS6pOlSQ
https://go.dev/tour/welcome/1
https://go.dev/tour/moretypes/8
https://github.com/Melkeydev/go-blueprint
https://www.youtube.com/watch?v=ERZadn9artM&t=1994s
https://pkg.go.dev/github.com/golang-jwt/jwt/v5
https://mui.com/material-ui/getting-started/installation/


docker exec -it password-manager-backend-mysql_bp-1 mysql -uroot -p
CREATE USER 'ferran'@'%' IDENTIFIED BY 'password1234';
GRANT ALL PRIVILEGES ON passwordManagerDatabase.* TO 'ferran'@'%';
FLUSH PRIVILEGES;
