var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

//keeeps track of the note in text//
var activateNote = {};
//gets notes from the db
var getNotes = function () {
    return $.ajax({
        url: '/api/notes',
        method: 'GET'
    });
};
//function saves the note//
var saveNote = function (note) {
    return $.ajax({
        url: '/api/notes',
        data: note,
        method: 'POST'
    });
};

//deletes from db//
var deleteNote = function (id) {
    return $.ajax({
        url: 'api/notes' + id,
        method: 'DELETE'
    });
};

var renderActiveNote = function () {
    $saveNoteBtn.hide();
  
    if (activeNote.id) {
      $noteTitle.attr("readonly", true);
      $noteText.attr("readonly", true);
      $noteTitle.val(activeNote.title);
      $noteText.val(activeNote.text);
    } else {
      $noteTitle.attr("readonly", false);
      $noteText.attr("readonly", false);
      $noteTitle.val("");
      $noteText.val("");
    }
  };

  var handleNoteSave = function () {
    var newNote = {
      title: $noteTitle.val(),
      text: $noteText.val()
    };
  
    saveNote(newNote).then(function (data) {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // delete the clicked note

  var handleNoteDelete = function (event) {
    event.stopPropagation();

    var note = $(this)
    .parent('.list-group-item')
    .data();

    if (activeNote.id === note.id) {
      activateNote = {};
    }

    deleteNote(note.id).then(function () {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  // sets the active note and displays

  var handleNoteView = function () {
    activeNote = $(this).data();
    renderActiveNote();
  };
// Sets active npte to an empty object
  var handleNewNoteView = function () {
    activeNote = {};
    renderActiveNote();
  };

  


