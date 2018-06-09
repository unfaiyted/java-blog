#Spring Boot Framework Java Blog
-
Spring Boot Java Blog application able to create and view
blog entries


#Setup

1. Clone/Fork repository 
2. Load/Install Maven dependencies
4. NPM Setup
    - 
    - Setup NPM using `npm install` command from command line
    - Once install completed you can auto compire js files using `npm run watch`
    - Webpack settings are stored in webpack.config.js
    
5. MySQL server setup
    - 
    - Install Mysql server for your platform.
    - Mac / Windows / Linux (Install Guides)
    - Setup a username/ password account and a database
    - Copy `example.properties` and change the name to `application.properties`
        - Modify these settings to watch your system setup and database naming.
    
6. Spring Setup
    -
    - JDK will need to be installed to setup on system. 
    - Ensure you update this `spring.devtools.restart.additional-paths` if you plan on using the dev tools.
    - ChromeDriver (Selenium) install and setup driver location. 
        - Location path must be specified in the `application.properties` file.
    