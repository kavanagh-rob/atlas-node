var request = require('request'); 
var express = require('express')
var cheerio = require('cheerio');
var finishedLoading = false;
var baceUrl = "http://www.sportinglife.com";
var racecardUrl = "http://www.sportinglife.com/racing/racecards";
var resultsUrl = "http://www.sportinglife.com/racing/fast-results";

var raceDaysArray = [];
var racesDaysMeetingArray = [];

//getRacecards(racecardUrl);
//getResults(resultsUrl);
getRaceDays(racecardUrl);

var server = express()

server.get('/days', function (req, res) {
  res.send(raceDaysArray);
//    res.send(racesMeetingsArray);
})

server.get('/meetings', function (req, res) {
    res.send(racesDaysMeetingArray);
})

server.listen(3000, function () {
  console.log('Atlas App listening on port 3000!')
})

function getRaceDays(url){
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var days = $('.hr-racing-racecards nav ul li a');
                days.each(function(i, days){
                    var day = {};
                    day.name =days.children[0].data;
                    day.uri = baceUrl+days.attribs.href;
                    raceDaysArray[i] = day;
                    getRacecards(day.uri, day.name, i);
                });
        }
    });
}

function getRacecards(url, day, index){
    var racesMeetingsParent = {};
    racesMeetingsParent.meetings = [];
    racesMeetingsParent.day = day;
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);var racesArray = [];
            var meetingIndex = 0;
              var meetingSections = $('.hr-meeting-container');
                meetingSections.each(function(i, meetingSection){
                        var courseName = $(meetingSection).find('.dividerRow h2').text();
                        if(isRelevantCourse(courseName)){
                            var racesArray = [];
                             $(meetingSection).find('li').each(function(i, raceElement){
                                var race = {};
                                race.time = $(raceElement).find('.hr-meeting-race-time').text();            
                                race.name = $(raceElement).find('.hr-meeting-race-name-star').text().trim();
                                 if( $(raceElement).find('.hr-meeting-race-result-fulllink-btn').attr('href')){
                                     race.resultLink = $(raceElement).find('.hr-meeting-race-result-fulllink-btn').attr('href').trim();
                                 }
                                racesArray[i] = race;
                            });
                            var meeting = {};
                            meeting.name = courseName;
                            meeting.races = racesArray;
                            racesMeetingsParent.meetings[meetingIndex] = meeting;
                            meetingIndex++;
                        }  
                });
            racesDaysMeetingArray[index] = racesMeetingsParent;
        }
    });
}

function getResults(url){
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var resultList = [];
            var resultsIndex = 0;
              var fastResults = $('.fast-results-list .fast-results-item');
                fastResults.each(function(i, resultElement){
                        var result = {};
                        var parts = $(resultElement).find('.fast-result-header-race').text().trim().split(" ");
                        result.raceCourse = parts[1];
                        if(parts.length >2){
                            result.raceCourse += parts[2];
                        }
                        if(isRelevantCourse(result.raceCourse)){
                            result.raceTime = $(resultElement).find('.time-short').text().trim();
                            result.racePositions = [];
                            $(resultElement).find('.fast-results-place').each(function(i, horseElement){
                                var horse = {};
                                    horse.position = $(horseElement).find('.fast-results-place-position').text().trim();
                                    horse.number = $(horseElement).find('.fast-results-place-number').text().trim();
                                    horse.name = $(horseElement).find('.fast-results-place-name').text().trim();
                                    horse.odds =  $(horseElement).find('.fast-results-place-odds').text().trim();
                                 result.racePositions[i] = horse;
                            });     
                        resultList[resultsIndex] = result; 
                        resultsIndex++;
                        }
                       
                }); 
            console.log(resultList);
        }
    });
}

function isRelevantCourse(courseName){  
    return britishRacecourses.indexOf(courseName) != -1 || irishRacecourses.indexOf(courseName) != -1 ;    
}


var britishRacecourses = [
    "MahoningValley",
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
    "Chelmsford", 
    "Chepstow",  
    "Chester",  
    "Doncaster",  
    "EpsomDowns",
    "Epsom",
    "Exeter",  
    "Fakenham",  
    "FfosLas",  
    "FontwellPark",
    "Fontwell",
    "Goodwood",  
    "GreatYarmouth",  
    "HamiltonPark",
    "Hamilton",
    "HaydockPark",  
    "Haydock",  
    "Hereford",  
    "Hexham",  
    "Huntingdon",  
    "Kelso",  
    "KemptonPark", 
    "Kempton", 
    "Leicester",  
    "LingfieldPark",  
    "Lingfield",  
    "Ludlow",  
    "MarketRasen",  
    "Market",  
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
    "Sandown",
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