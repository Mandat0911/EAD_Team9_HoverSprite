# Project Name: HoverSprite-Organic-Sprayer-Management-System
# Overview
HoverSprite is a start-up Vietnamese agricultural solutions company based in the Southwest Provinces. It specializes in organic fertilizer and pesticide spraying services for farmers, utilizing a fleet of 15 spraying drones to serve orchards, cereal fields, and vegetable farms.
The Hoversprite application is a web-based platform designed for user management and role assignment. This project uses Spring Boot with JPA for backend services, MySQL for the database, and Thymeleaf for the frontend.

# Prerequisites
Before you begin, ensure you have the following software installed:

Java JDK 21 or higher

Maven

MySQL

Spring Boot: This project uses Spring Boot for its application framework.

# Installation

Clone the Repository: https://github.com/Mandat0911/EAD_Team9_HoverSprite.git

## Configure Database

### 1. Install MySQL and create a new database:

`CREATE DATABASE hoversprite;`

### 2. Configure Database Connection:
MySQL of app in `application.properties`

`spring.datasource.url=jdbc:mysql://localhost:3306/hoversprite`

`spring.datasource.username=root`

`spring.datasource.password=yourpassword`

`spring.jpa.hibernate.ddl-auto=update`

`spring.jpa.show-sql=true`

### 3. Optional `HTTPS` Config:
This is for web app can opeerate under SSL self-signed certificate. If you have not set local certificate on your local device, you should comment lines below:

`server.ssl.key-store=classpath:keystore.p12`

`server.ssl.key-store-password= your ssl password`

`server.ssl.key-store-type=PKCS12`

`server.ssl.key-alias=local_ssl`

`server.port=8443`

Otherwise, the web app will run on port 8443. In the show case, web app will run as `https://localhost:8443`

# Usage
All roles of user and table will be automatically created. However, 1 receptionist will be create but role is not assigned yet. You should go to `users_roles` table in Mysql to manipulate role.
### Users_roles
`user_id`|`role_id`

`   1   `   |`   2   `

### Role 
`id` 1 `farmer`

`id` 2 `receptionist`

`id` 3 `sprayer`

# Troubleshooting
Detached Entity Exception: Ensure that roles are fetched from the database before assigning them to users to avoid detached entity exceptions.

Database Connectivity Issues: Verify that the MySQL server is running and the connection details in application.properties are correct.
























UML: https://lucid.app/lucidchart/b91b1f04-db1d-4fb8-b80c-93b14a33223f/edit?invitationId=inv_47c0d550-eb68-478d-8cc1-e076ae53437d&fbclid=IwY2xjawEuZQJleHRuA2FlbQIxMAABHTQMjCXQ7zh2FS_svFVqGLvKOw9FxF_kqd17EeDumv0alX8XEMlW3On71Q_aem_amvl4Kl7b0KaUSceX1DQ3Q&page=0_0#

repo: https://github.com/Mandat0911/EAD_Team9_HoverSprite.git


