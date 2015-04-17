# AutoTags #
# Automatic Tag Suggestions #

This project is now on Github: http://mrolafsson.github.io/autotags/

Suggest tags or concepts/keywords (single and compound terms) for a given piece of text with JavaScript using simple unsupervised, semantic analysis.

This approach accounts for common inflections (using a JavaScript implementation of the Porter stemming algorithm) supported by a configurable white- and black list of terms. Compound terms are detected through bigram analysis and pattern matching of capitalised word sequences; taking into account boundaries like punctuation, tabs, line breaks etc. Term scoring is done using a set of tuneable parameters that weight individual tags based e.g. on frequency, capitalisation, type (compound vs. single terms) etc.

## Usage (JavaScript) ##
```
var autoTags = new AUTOTAGS.createTagger({}); // Create an instance of the AutoTags tagger
autoTags.COMPOUND_TAG_SEPARATOR = '_'; // An example of how to change the word separator in multi-word tags

var tagSet = autoTags.analyzeText( 'text to suggest tags for...', 10 ); // Suggest 10 tags for a given piece of text

for ( var t in tagSet.tags ) {
	var tag = tagSet.tags[t];
	... tag.getValue(); // The tag itself
}
```

### Note: ###
For convenience I have chosen to commit one loose dependency, a JavaScript implementation of the [Porter Stemming Algorithm](http://tartarus.org/martin/PorterStemmer/index.html) created by [Andargor](http://www.andargor.com/).