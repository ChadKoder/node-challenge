NodeJS Sample Application
Description: 
	This application demonstrates the use of NodeJS as a web service 
Setup Instructions:
1. Install NodeJS: https://nodejs.org/en/download/
2. Extract zip file to desired location.
3. Open your preferred command line tool (I use Console Emulator: https://sourceforge.net/projects/conemu/) and navigate to the location of the extracted files.
4. Run 'npm install' to download the dependencies.
5. Run 'node server' to start hosting
6. Open a browser and navigate to http://localhost:8888/
7. Login with a valid user -> user name: user, password: pass <- is one that will work.
8. On successful login you will see the main page. Here you have the option to view the encoded token or logout.



NOTES:
Authentication:
Pass 'Authentication' header for 'Basic' authentication with encoded "username:<username>,password:<password>"


