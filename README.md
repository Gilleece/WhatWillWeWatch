# What Will We Watch

[Live link](https://gilleece.github.io/WhatWillWeWatch/)

[GitHub Repository](https://github.com/Gilleece/WhatWillWeWatch)

![](assets/readme/responsiveness.png)

WhatWillWeWatch.com is my milestone 2 project. It is a site built upon "The Movie DataBase" api, using a variety of endpoints to bring users a simple front end that allows them to get movie recommendations based on their preferences, along with inputting their country to see on which services the movies are available for streaming or renting. The site is fully responsive and laid out in a minimal manner to present users with meaningful movie choices, and enough data to make those choices without being overwhelming or cluttered. The bulk of the site is dynamically generated through JS along with utilizing local storage to make for a more seamless and enjoyable user experience. 
 
# Table of contents
1. [UX](#UX)
    1. [First Time Visitor Goals](#firsttime)
    2. [Returning Visitor Goals](#returning)
2. [Design](#design)
    1. [Colour Scheme](#colour)
    2. [Typography](#typo)
    3. [Layout](#layout)
    4. [Wireframes](#wireframes)
3. [Features](#features)
    1. [Existing Features](#existing)
    2. [Future Features](#future)
4. [Technologies Used](#tech)
5. [Testing](#testing)
    1. [Manual Testing](#manual)
    2. [Automatic Testing](#auto)
    3. [Bugs](#bugs)
    4. [Known Issues](#issues)
6. [Deployment](#deployment)
    1. [Github Pages](#pages)
    2. [Making A Local Clone](#local)
7. [Credits](#credits)
8. [Media](#Media)

## UX <a name="UX"></a>

The primary goal with the sites UX, in terms of UI, was to make the website minimal and uncluttered. The website is design to clearly and simply present the user data that they will find useful and help them acheive their goal of choosing a movie to watch. 

### First Time Visitor Goals: <a name="firsttime"></a>
- As a first time visitor I need to be able to navigate the site easily and clearly understand how to use the function of the site.
- I want to be able to see a clear list of movies, along with relevant details.4
- I want to quickly and easily alter my search preferences to get other movie recommendations.

### Returning Visitor Goals: <a name="returning"></a>
- I want my region saved to reduce the required input necessary.
- I want the experience to remain consistent and continue to easily find good choices for me to watch.
- I perhaps want to contain the site owner to make a suggestion.

## Design: <a name="design"></a>

### Colour Scheme: <a name="colour"></a>
![](assets/readme/colors.png)
- The site's primary colours are blue, white, black and orange. The above image shows the original colour selection for the site, the blue being the primary colour that all other colours were derived from using Abobe's colour tool [here](https://color.adobe.com/create/color-wheel)
- I wanted to deliberately avoid colour schemes used by any particular streaming/rental service (such as Netflix). This was so avoid any perceived bias towards one service or such. 

### Typography: <a name="typo"></a>
- Site wide, Archivo is used. Being provided by google fonts.
- This font was chosen as it looks modern and is easy to read.

### Layout: <a name="layout"></a>
- As mentioned earlier, the site is deliberately minimal in its style and layout. I chose to avoid images to keep the user focused on the movie recommendations, rather than the site surrounding them.
- Movie recommendations are presented as cards and site is built upon Bootstrap's grid system. The recommendation cards scale in number shown at once depending on the site of the users device.
- Basic info is presented at a glance, such as the movie's score, name, if a trailer is available and the poser. Users can click for an accordion style drop down to display more detailed information.

### Wireframes: <a name="wireframes"></a>

- The site's design ultimately shifted somewhat from the original wireframe, as I built the functionality of the site first and the frontend after. As a result, the original wireframe I made, before making any of the site, didn't seem ideal anymore and therefore I decided to change some aspects of the design to better suit where the completed functionality brought my thinking to.
- Here is the original wireframe: 

![](assets/readme/wireframe.png)


## Features <a name="features"></a>

### Existing Features <a name="existing"></a>
- Responsive on all devices.
- Utilizes multiple api calls from a single user input to gather all relevant movie recommendations, their details and the sorting order.
- The site makes use of local storage to enhance the user experience upon return visits.
- HTML is dynamically generated and the site's layout dynamically responses to this.
- The site utilizes, as it's inital sorting option, a "popularity" aspect of the api so that not just new movies are shown but rather movies that the community interacting with the database are interested in. This leads to more varied and useful results.
 

### Future Features <a name="future"></a>
- The site could be updated to allow users to input their rating of a movie, allowing them to interact with the database.
- User accounts so that users can add their "watched" movies to their account, which will be filtered out of the results and could be used for recommendations also (finding similar movies etc).

## Technologies Used <a name="tech"></a>

1. [HTML:](https://www.w3.org/html/)
    - HTML was used for the content and structure of the site, with emphasis placed on semantic elements and text alternatives for screen readers.
1. [CSS:](https://www.w3.org/Style/CSS/)
    - Bootstrap was used to assist with the responsiveness and styling of the website.
1. [Javascript:](https://www.javascript.com/)
    - Javascript was used for the site's functionality and to generate html dynamically.   
1. [Bootstrap 4.5.3:](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
    - Bootstrap was used to assist with the responsiveness and styling of the website.
1. [Google Fonts:](https://fonts.google.com/)
    - Google fonts were used to import the 'Archivo' font into the style.css file which is used throughout the project.
1. [Font Awesome:](https://fontawesome.com/)
    - Font Awesome was used on all pages throughout the website to add icons for aesthetic and UX purposes.
1. [jQuery:](https://jquery.com/)
    - jQuery was used for the api calls and for the flex data list. It was also used for dynamically generating HTML.
1. [Git](https://git-scm.com/)
    - Git was used for version control by utilizing the Gitpod terminal to commit to Git and Push to GitHub.
1. [GitHub:](https://github.com/)
    - GitHub is used to store the project's code after being pushed from Git.
1. [Balsamiq:](https://balsamiq.com/)
    - Balsamiq was used to create the wireframes during the design process.
1. [Adobe Color:](https://color.adobe.com/create/color-wheel)
    - Adobe Color was used to find suitable, complimentary, colours.    
1. [Gitpod:](https://www.gitpod.io/)
    - This was my IDE for the project. 



## Testing <a name="testing"></a>

Testing was carried out both manually and automatically. 

### Manual Testing: <a name="manual"></a>

While building the site I had a preview open in my browser that I would check regularly to ensure that the results were as intended. I made use of developer tools within the browser constantly to check
across a number of things. I would use the console tools to try out different ideas, particularly styling, to see how it worked in real time and then implement the code written there into the project itself.
Responsiveness testing was done both through console tools, along with trying different browsers on different devices. 

My manual testing process was as follows.

#### For each page I performed the following checks:
    * Desktop and mobile
        - Make sure content loads properly, and timely.
        - No errors in console log, or IDE.
        - Try various potential user inputs and search parameters.
        - Try various things like refreshing the page in different sections.
        - Look for results that broke the styling in anyway.
        - Test different scenarios to see if the site continued worked (for example, I would input search parameters that return no results and see if the site continues functioning after this)
        - Emulate different errors like 404 to make sure they were being handled correctly.
    * Mobile only        
        - Try common gestures like pinch to zoom, rotating orientation        

    All tests were performed across multiple browsers and OS.
            
### Bugs: <a name="bugs"></a>

This is not an exhaustive list but gives examples of some particular bugs that occured and how I fixed them.

#### Bug: Setting the "decade from" caused no results to show up, even though "decade to" worked just fine. "decade from" default also worked just fine.

Solution: Initially I couldn't see any error in the syntax of my code. The test implied that
the "decade from" was causing the error. Eventually I realized that trying 
different dates was causing no issues. It turned out to be a simple error of 
copy/pasting code and not correctly updating it. As a result in my HTML for
the "decade to" selector, it had "from" typed in instead of "value". It was just a
simple error but was a good lesson in remembering to look at the simplest 
issues first instead of trying to change things that I assume to be the 
problem without having any real solid evidence for such assumptions.

#### Bug: Some movie runtimes are input wrong into the api database

Solution: The api that I used, tmdb, relies upon community fed information. For the
most part this is great and enables such a wonderful api but for runtime, some movies get entered in 
incorrectly. For example, a 1hr39min movie may get entered in as just 
39mins due to a typo. My original plan was to allow for movie runtime search to be from 3 
hours down to 30 minutes. However, at these lower times there were often 
feature length movies included in the result. This is unavoidable 
due to not being able to control that aspect of the database. As a result, my 
compromise was to set a 60 minute limit in the code to searchs, and restrict 
search criteria from "any length" to "1.5 hours max". This meant that results 
were accurate. The site was intended for feature length movies, so this
hasn't really impacted the intended purpose of the site whilst also taking
away what would be a very frustrating experience for users.

This was a particularly useful issue in learning the limitations of some APIs and improving my approach towards
using them. 

#### Bug: Api returns certain data in a manner that is not particularly useful to the user.

Solution: The best example of this is the language that is returned for each movie. Rather than returning 
"English", for example, it would return EN. To make the user experience better I utilized a list of language codes,
that I placed into an object, and through this was able to return plain words such as "German" etc instead of a language code. 

#### Bug: Moved recommendation Card from index.html into main.js to dynamically generate it, however the play trailer button is no longer working.

Solution: I originally tested to see if the link being generated was broken, then to see if
the html being generated was broken. I tried removing any dynamically 
generated parts and manually inserting them. Eventually I realized that the
issue was with the snippet of code that controls the autoplay on and off 
feature. It was being executed before the rest of the code related to the play
trailer button. The easiest solution was to simple move it into the same loop
as the other code and the problem was solved. 

#### Bug: Deferred exceptions appearing in the console log for whereToRent and whereToStream

Solution: Although the functionality of the code was unaffected, I kept getting these 
errors in the console. What I realized was that when my code was checking if the selected 
country had choices to rent or stream the movie I was missing a check to see if the selected country was actually being returned by the api call in the 
first place. Putting an additional check for the country fixed this error.


### Known issues: <a name="issues"></a>

Currently, there is one known issue.

#### Known issue: Calling embedded youtube videos, in this case clicking on "Play Trailer" button causes a console log error "GET chrome-extension://invalid/ net::ERR_FAILED".

More details: Searching online shows that this has been going back to 2015, and it seems to be unavoidable. 
It has no impact on functionality and doesn't reference any code in my project (rather it referes to "remote.js:35, on google's side). 

### Automatic Testing: <a name="auto"></a>

[W3C Validator HTML result](assets/readme/w3chtml.png) (Shows no errors).

[W3C Validator CSS result](assets/readme/w3ccss.png) (Shows no errors).

## Deployment <a name="deployment"></a>

### GitHub Pages <a name="pages"></a>

I deployed this site through GitHub pages. This was a simple process, as follows:

- Log into GitHub

- Go to the repository (you must own it, so fork mine if deploying this site)

- Go to settings

- Scroll down to "GitHub Pages" section

- Select the source (I chose master branch in this instance)

- After some time, the site will be deployed at: ```http://<username>.github.io/<repository-name>```

### Making A Local Clone <a name="local"></a>


- Log in to GitHub and locate the [GitHub Repository](https://github.com/Gilleece/CodeInstitute-Milestone-Project-1)
- Under the repository name, click "Clone or download".
- To clone the repository using HTTPS, under "Clone with HTTPS", copy the link.
- Open Git Bash
- Change the current working directory to the location where you want the cloned directory to be made.
- Type `git clone`, and then paste the URL you copied in Step 3.

```
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
```

- Press Enter. Your local clone will be created.

```
$ git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
> Cloning into `CI-Clone`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```

Click [Here](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository#cloning-a-repository-to-github-desktop) to retrieve pictures for some of the buttons and more detailed explanations of the above process.


## Credits <a name="credits"></a>
- Thanks to [Reuben Ferrante](https://github.com/arex18), my Code Institute mentor, for his guidance and insight.

- Thanks to the Code Institute Slack community, it was a great resource for issues.

- Color scheme based suggests from Abobe Color.

- Bootstrap, particularly their great documentation.

- W3Schools, for their fantastic explanations and useful examples.

- The Movie DataBase, whose API made this possible. 

- Scroll to top button credit to: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

- Youtube trailer button functionality, credit to Jacob Lett: https://codepen.io/JacobLett/pen/xqpEYE

- Language Codes, used to change api returned lang codes into language name for user readability. Sourced from, and credit to: https://gist.github.com/wpsmith/7604842

- Scroll to top button credit to: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

- Fade Ins and pulse from https://www.theappguruz.com/tag-tools/web/CSSAnimations/

- FlickerAnimation, credit to: https://stackoverflow.com/questions/23985018/simple-css-animation-loop-fading-in-out-loading-text 

