/* global sharing */
var nouns = [],
    verbs = [],
    nounPlural;

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function generate() {
  var generatedText = 'Darius ' + nounPlural.pluralize() + ' what he ' + verb.pluralize();
  if (!isBad(generatedText)) {
    $('#content').html(generatedText);
  }
}

function getWords(suppressGenerate) {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=verb-transitive&limit=1000&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    })
  ).done(function(noun_data, verb_data) {
    nouns = noun_data.pick().word;
    nounPlural = nouns;
    console.log(nounPlural);
    $.ajax({
      url: 'http://api.wordnik.com/v4/word.json/' + nounPlural + '/relatedWords?useCanonical=true&relationshipTypes=rhyme&limitPerRelationshipType=10&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    }).done(function(verb_data) {
      console.log(verb_data);
      if (!verb_data[0]) {
        $('#content').html('Couldn\'t find a rhyme :(');
        return;
      }
      verb = verb_data[0].words.pick();
      console.log(verb);
      if (!suppressGenerate) {
        generate();
      }
    });
  });
}

function isBad(word) {
  for (var i=0;i<badwords.length;i++) {
    if (word.indexOf(badwords[i]) >= 0) {
      return true;
    }
  }
  return false;
}

$('#generate').click(function() { getWords(); });
getWords();
