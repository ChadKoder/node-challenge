Tenable Backend Challenge - Microservices
Description: 
	- This application demonstrates the use of NodeJS as a web service 
	- AUTHENTICATION, CONFIGURATIONS, and SORTING are demonstrated in this application
		-> The details are at the bottom of this document that describe how the app demonstrates each
	
	
Manual Setup Instructions:
1. Install NodeJS: https://nodejs.org/en/download/
2. Extract zip file to desired location.
3. Open your preferred command line tool (I use Console Emulator: https://sourceforge.net/projects/conemu/) and navigate to the location of the extracted files.
4. Run 'npm install' to download the dependencies.
5. Run 'node server' to start hosting
6. Open a browser and navigate to http://localhost:8888/
7. Login with a valid user -> user name: user, password: pass <- is one that will work.
8. On successful login you will see the main page. Here you have the option to view the encoded token or logout.


Automated Setup Instructions:
1. Install NodeJS: https://nodejs.org/en/download/
2. Extract zip file to desired location.
3. Open your preferred command line tool (I use Console Emulator: https://sourceforge.net/projects/conemu/) and navigate to the location of the extracted files.
4. Run 'build.sh' from the extracted file location to install dependencies.
5. Run 'launchChrome.sh' or 'launchInternetExplorer.sh' to run the server and launch the application from your browser of choice (currently only supports chrome/iexplore)


Server Tests:
NOTE: Must run 'serverTests/launchForServerTests.bat' before running 'runServerTests.sh'.
1. run 'serverTests/launchForServerTests.bat'
2. Run 'runServerTests.sh' to launch unit tests.

Angular Unit Tests:
- Navigate to 'tests' folder and open 'SpecRunner.html' in a browser. This will run all unit tests and display the results.


NOTES:
The follow features are available and can be seen in the UI. 
-- If you want you can also view the backend alone (files below)
	-> FILES: server.js (in root folder), httpHandlerService.js(src folder), responseService.js (src folder)
	-> server tests are in /serverTests/ folder
	
AUTHENTICATION:
- Login with basic authentication
	- valid users are:
		- username: chadk password: Tenable
		- username: admin password: 123xyzABC!@
		- username: user password: pass

- Logout on the configurations page once you login(top right button) 
	- logging out clears the stored base64 value created from username and login. 
		TODO: update to use something better than basic auth.

CONFIGURATIONS:
- Create, Delete, Modify, and Add user configurations using JSON.
- 12 configurations exist now and are able to be modified and saved to json file in /src/ folder.

SORTING:
- Sort:
	- Click on the column headers to sort(name, hostname, port, user name)
	NOTE: Needs work, each column only sorts ascending right now.
- Pagination:
	- User configurations are paged, currently displaying 5 configurations per page.
	- next/prev buttons available to navigate through the list
	- button disables when at beginning or end of the list
	NOTE: When adding, editing, or sorting the page will refresh back to page 1. 
		  This is not very desirable, but will work for this iteration.	  
 
			
			
			
			