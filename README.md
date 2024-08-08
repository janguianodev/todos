# Development
## Steps to setup development app

 1. Setup the database
 ```
    docker compose up -d
 ```

 2. Rename the `.env.template` file to `.env`
 3. Replace the environment variables.
 4. Run ```npm install```
 5. Run ```npm run dev```
 6. Run these prisma commands
   ```
      npx prisma migrate dev
      npx prisma generate
   ```   
 7. Execute [seeder](http://localhost:3000/api/seed) to create the local database.

 ## Note: Default credentials:
 __email__: test@test.com
 __password__: 123456"
 
## Prisma commands
```
     npx prisma init
     npx prisma migrate dev
     npx prisma generate
```