var autoTags;
var debug = false;
var messageContainer, tagsContainer, debugContainer, tagTextField;
var selectedTagsArray;
var CSS_TAG_SELECTED = 'tagSelected';
var CSS_TAG_NOT_SELECTED = 'tagNotSelected';

window.onload = function() {
	messageContainer = document.getElementById('messageContainer');
	tagsContainer = document.getElementById('tagsContainer');
	debugContainer = document.getElementById('debugContainer');
	tagTextField = document.textForm.txtTags;
	tagsContainer.innerHTML = '';
	
	//
	autoTags = new AUTOTAGS.createTagger({});
	//
}

function setSeparator( spaceSeparation ) {
	if ( spaceSeparation ) {
		autoTags.SEPARATION = AUTOTAGS.SPACE_SEPARATION;
	} else {
		autoTags.SEPARATION = AUTOTAGS.DEFAULT_SEPARATION;
	}
}

function setCompoundBoost( compoundBoost ) {
	if ( compoundBoost ) {
		autoTags.NGRAM_BASED_ON_CAPITALISATION_BOOST = 7;
		autoTags.BIGRAM_BOOST = 5;
	} else {
		autoTags.NGRAM_BASED_ON_CAPITALISATION_BOOST = 3.5;
		autoTags.BIGRAM_BOOST = 2.5;
	}
}

function selectTag( tagElement ) {
	var tag = tagElement.innerHTML;
	var exists = false;

	for ( var i = 0; i < selectedTagsArray.length; i++ ) {
		if ( selectedTagsArray[i] == tag ) {
			selectedTagsArray.splice(i, 1);
			exists = true;
			break;
		}
	}

	if ( exists != true ) {
		selectedTagsArray.push( tag );
		tagElement.className = CSS_TAG_SELECTED;
	} else {
		tagElement.className = CSS_TAG_NOT_SELECTED;					
	}

	tagTextField.value = selectedTagsArray.join(', ');
}

function populateExistingTagsArray() {
	selectedTagsArray = new Array();
	tempArray = tagTextField.value.split( ',' );
	
	if ( tagTextField.value.length > 0 ) {
		for ( var t = 0; t < tempArray.length; t++ ) {
			selectedTagsArray.push( AUTOTAGS.trim( tempArray[t] ) );
		}
	}
	
	return selectedTagsArray;
}

function generateTags( text, termCount, debug ) {
	//
	var tagSet = autoTags.analyzeText( text, termCount );
	//
	
	this.debug = debug;
	var debugTable;
	var debugTableBody;
	var debugTableHeader;
	
	populateExistingTagsArray();
	messageContainer.innerHTML = 'It took ' + autoTags.getAlgorithmTime() + ' ms. to generate tags from ' + text.split(' ').length + ' words!';
	
	tagsContainer.innerHTML = '';
	debugContainer.innerHTML = '';
	
	if ( this.debug ) {
		debugTable = document.createElement('table');
		debugTable.className = 'debugTable';
		
		debugTableHeader = document.createElement('thead');
		debugTableBody = document.createElement('tbody');
		
		var tableHeaderRow = document.createElement('tr');
		
		var headers = [ 'Tag', 'Freq.','Score','Term Type', 'In WL.' ];
		
		for ( var header in headers ) {
			tableHeaderRow.appendChild( createHtmlTextNode( 'td', headers[header]) );
		}

		debugTableHeader.appendChild( tableHeaderRow );
	}
	
	for ( term in tagSet.tags ) {
		var tag = tagSet.tags[term];
		tagsContainer.appendChild( getHtmlTagElement(tag) );
		
		if ( this.debug ) {
			var debugElement = document.createElement('tr');
			var fields = [ '_term', 'freq','score','termType' ];

			for ( var field in fields ) {
				debugElement.appendChild( createHtmlTextNode( 'td', tag[fields[field]] ) );
			}
			
			var inWhiteList;
			if ( autoTags.isInWhiteList( tag.getValue() ) ) {
				inWhiteList = 'x';
			} else {
				inWhiteList = '';
			}
			debugElement.appendChild( createHtmlTextNode( 'td', inWhiteList ) );
			
			debugTableBody.appendChild(debugElement)
		}
	}
	
	if ( this.debug ) {
		debugTable.appendChild( debugTableHeader );
		debugTable.appendChild( debugTableBody );
		debugContainer.appendChild( debugTable );
	}
	
	
}

function createHtmlTextNode( type, value ) {
	var cell = document.createElement( type );
	var cellText = document.createTextNode( value );
	cell.appendChild( cellText );
	
	return cell;
}

function getHtmlTagElement( tag ) {
	var tagElement = document.createElement('div');
	tagElement.innerHTML = tag.getValue();
	tagElement.onclick = function() { selectTag( this ); };
	tagElement.className = CSS_TAG_NOT_SELECTED;
	
	for ( var i = 0; i < selectedTagsArray.length; i++ ) {
		if ( tag.getValue() == selectedTagsArray[i] ) {
			tagElement.className = CSS_TAG_SELECTED;
			break;
		}
	}
	
	return tagElement;
}