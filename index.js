var request = require('request'); 

var cheerio = require('cheerio');
var finishedLoading = false;
var racecardUrl = "http://www.sportinglife.com/racing/racecards";
var resultsUrl = "http://www.sportinglife.com/racing/fast-results";

//getRacecards(racecardUrl);
getResults(resultsUrl);

function getRacecards(url){
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
              var meetingSections = $('.rac-dgp');
            meetingSections.each(function(i, raceMeetingSectionElement){
                    var courseName = $(raceMeetingSectionElement).find('h3 a').text().replace(/\s/g,'');
                console.log(courseName)
                    if(isRelevantCourse(courseName)){
                        console.log(courseName);
                        var racesArray = [];
                         $(raceMeetingSectionElement).find('.rac-cards').each(function(i, raceElement){
                            var race = {};
                            race.raceTime = $(raceElement).find('.ixt').text();
                            race.raceName = $(raceElement).find('.ixc').text().trim();
                            racesArray[i] = race;
                        });   
                    }  
            });
        }
    });
}

function getResults(url){
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var resultList = [];
              var fastResults = $('.fast-results-list .fast-results-item');
                fastResults.each(function(i, resultElement){
                        var result = {};
                
                        result.raceCourse = $(resultElement).find('.fast-result-header-race').text().trim();
                        result.raceTime = $(resultElement).find('.time-short').text().trim();
                        result.racePositions = [];
                        $(resultElement).find('.fast-results-place').each(function(i, horseElement){
                            var horse = {};
                                horse.position = $(horseElement).find('.fast-results-place-position').text().trim();
                            console.log($(horseElement).find('.fast-results-place-position').text().trim());
//                                horse.number = $(horseElement).find('td')[1].children[0].data.trim();
//                                horse.odds = $(horseElement).find('td')[2].children[0].data.trim();
//                                horse.name =  $(resultElement).find('a').text();
                             result.racePositions[i] = horse;
                        });     
                    resultList[i] = result; 
                });       
        }
    });
}

function isRelevantCourse(courseName){
    return britishRacecourses.indexOf(courseName) != -1 || irishRacecourses.indexOf(courseName) != -1 ;    
}


var britishRacecourses = [
    "Aintree",  
    "Ascot",  
    "Ayr",   
    "Bath",  
    "Beverley",  
    "Brighton",  
    "Carlisle",  
    "Cartmel",  
    "Catterick",  
    "Cheltenham",  
    "ChelmsfordCity",  
    "Chepstow",  
    "Chester",  
    "Doncaster",  
    "EpsomDowns",  
    "Exeter",  
    "Fakenham",  
    "FfosLas",  
    "FontwellPark",  
    "Goodwood",  
    "GreatYarmouth",  
    "HamiltonPark",  
    "HaydockPark",  
    "Hereford",  
    "Hexham",  
    "Huntingdon",  
    "Kelso",  
    "KemptonPark",  
    "Leicester",  
    "LingfieldPark",  
    "Ludlow",  
    "MarketRasen",  
    "Musselburgh",  
    "Newbury",  
    "Newcastle",  
    "Newmarket",  
    "NewtonAbbot",  
    "Nottingham",  
    "Perth",  
    "Plumpton",  
    "Pontefract",  
    "Redcar",  
    "Ripon",  
    "Salisbury",  
    "SandownPark",  
    "Sedgefield",  
    "Southwell",   
    "Taunton",  
    "Thirsk",  
    "Towcester",  
    "Uttoxeter",  
    "Warwick",  
    "Wetherby",  
    "Wincanton",  
    "Windsor",  
    "Wolverhampton",  
    "Worcester", 
    "York"
]

irishRacecourses = [
    "Ballinrobe",    
    "Bellewstown ",  
    "Clonmel",  
    "Cork",  
    "TheCurragh",   
    "Dundalk",  
    "Fairyhouse",  
    "Galway",  
    "GowranPark",  
    "Kilbeggan",  
    "Killarney",  
    "Laytown",  
    "Leopardstown",  
    "Limerick",  
    "Listowel",  
    "Naas",  
    "Navan",  
    "Punchestown",  
    "Roscommon",  
    "Sligo",  
    "Thurles", 
    "Tipperary",  
    "Tralee",  
    "Tramore",  
    "Wexford"
]