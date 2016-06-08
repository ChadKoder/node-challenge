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
5. Run 'node server', 'node server chrome', or 'node server iexplore' to start hosting
6. Open a browser and navigate to http://localhost:8888/ (if you started with node server <browser> then you don't need to do this step.
7. Login with a valid user -> user name: user, password: pass <- is one that will work.
8. On successful login you will see the user configurations page. It displays all user configurations in the 'src/configurations.json' file. you can add/edit/delete here.


Automated Setup Instructions:
1. Install NodeJS: https://nodejs.org/en/download/
2. Extract zip file to desired location.
3. Run 'build.bat' to install dependencies.
4. Run 'launchChrome.bat' or 'launchInternetExplorer.bat' to run the server and launch the application from chrome or internet explorer


Server Tests:
NOTE: Must run 'serverTests/startServer.bat' before running 'runServerTests.bat'.
	-> Executing from the .bat file works, but does not display nicely right now.
1. run 'serverTests/startServer.bat'
2. Run 'runServerTests.bat' to launch unit tests.

Angular Unit Tests:
NOTE: Had to separate controller tests because of the structure of the project. 
- Navigate to 'unitTests' folder and open 'SpecRunner-ConfigurationCtrl.html' and 'SpecRunner-LoginCtrl.html' in a browser.
	This will run all unit tests and display the results.

***The follow features are available and can be seen in the UI. ***
-- If you just want to see the code, check out the server.js file along with the 'src' folder (the proj stucture needs cleaned up a bit)
-> BACK END FILES: server.js (in root folder), httpHandlerService.js(src folder), responseService.js (src folder)

AUTHENTICATION:
- Login with basic authentication
	- valid users are:
		- username: chadk password: Tenable
		- username: admin password: 123xyzABC!@
		- username: user password: pass

- Logout option on the configurations page once you login(top right screen) 
	- logging out clears the stored base64 value created from username and login. 
		TODO: update to use something better than basic auth.

CONFIGURATIONS:
- Create, Delete, Modify, and Add user configurations using JSON.
- 12 configurations exist now and are able to be modified and saved to json file in /src/ folder.

SORTING:
- Sort:
	- Click on the column headers to sort by name, hostname, port, or user name
	NOTE: Needs work, each column only sorts ascending right now.
- Pagination:
	- User configurations are paged, currently displaying 5 configurations per page. 
	- next/prev buttons available to navigate through the configurations
	NOTE: When adding, editing, or sorting the page will refresh back to page 1. 
		  This is not very desirable, but will work for this iteration.	  
	 
				
			
			
			