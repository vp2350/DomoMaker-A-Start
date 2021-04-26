Vansh Pahuja
Milestone README

Endpoint URLs: 
'/maker':
Supported Methods: GET, POST
Home page. I did not know there was a tutorial for file sharing so I tried my best to do it on my own, but then I found out there was one and it was much easier, but it took up a lot of time before I discovered that. 

'/upload' : 
Supported Methods: GET, POST
Upload and search file page from the class demo. I did the search part for Domo E and that has been worked out here properly with the help of the demo.

'/retrieveFile': 
Supported Methods: GET
retrieves the file with the name given in the query parameter.

What my site does: 
My site is a fileshare system, but it differentiates itself because I plan to make it so you can search by file name, which is already implemented, but also by a user's name so you could see all the files a user has uploaded. 

Besides that, I want to let the user input a text field in the Markdown language and use an external library and React to parse into into a proper readable text when you click on a file, opening on a new page along with the download link. 

If possible, depending on the file type, I would also like to have a picture/audio/video player to play the file if I have the time to implement that. 

I am currently storing user data as well as file data in Mongo, but I plan to clean my schemas up and combine them. 

Handlebars will be used to show upload files, show lists of searched files based on file names or username, and to parse the Markdown text into a readable format.

Next steps: 
1) My first major step is to clean up the code and get rid of everything Domo and change the schemas to fit what I need exactly.
2) My next step is to properly implement the search and display features with the file and user names.
3) Then I will implement the Markdown parser and the download link page.
4) The fourth step will be stylize each page, hopefully keeping the style somewhat consistent across all of them.
5) If I still have time, I will implement a system to display/play the file contents.
