var getWidgetContent = function(notes) {
  let notesListElm = notes.map(note => {
    return `<li class="self">${note}</li>`;
  });

  return `<!DOCTYPE html>
  <html>

  <head>
    <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" async href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <link rel="stylesheet" async href="./index.css" />

  </head>

  <body>
    <div class="floating-chat">
      <i class="fas fa-edit" aria-hidden="true"></i>
      <div class="chat">
        <div class="header">
          <span class="title">
            QUIPS
          </span>
          <button>
            <i class="fa fa-minus" aria-hidden="true"></i>
          </button>

        </div>
        <ul class="messages">
          ${notesListElm}
        </ul>
        <div class="footer">
          <div class="text-box" contenteditable="true" disabled="true"></div>
          <button id="sendMessage">send</button>
        </div>
      </div>
    </div>
  </body>

  </html>`;
};

// Ike's code begins

var currentUrl = location.href;

var myStorage = chrome.storage;

myStorage.sync.get(currentUrl, function(notes) {
  // console.log("notes: ", notes);
  notes = Object.keys(notes).length === 0 ? [] : notes[currentUrl];

  $('body').prepend(getWidgetContent(notes));

  var element = $('.floating-chat');

  // Entry point
  element.click(openElement);

  setTimeout(function() {
    element.addClass('enter');
  }, 1000);
});

// console.log('My Storage =>', myStorage);

myStorage.onChanged.addListener(function(notes, storageName) {
  chrome.browserAction.setBadgeText({
    text: notes[currentUrl].length.toString(),
  });
});
// Ike's code ends

function openElement() {
  var element = $('.floating-chat');

  var messages = element.find('.messages');
  var textInput = element.find('.text-box');
  element.find('>i').hide();
  element.addClass('expand');
  element.find('.chat').addClass('enter');
  var strLength = textInput.val().length * 2;
  textInput
    .keydown(onMetaAndEnter)
    .prop('disabled', false)
    .focus();
  element.off('click', openElement);
  element.find('.header button').click(closeElement);
  element.find('#sendMessage').click(sendNewMessage);
  messages.scrollTop(messages.prop('scrollHeight'));
}

function closeElement() {
  var element = $('.floating-chat');

  element
    .find('.chat')
    .removeClass('enter')
    .hide();
  element.find('>i').show();
  element.removeClass('expand');
  element.find('.header button').off('click', closeElement);
  element.find('#sendMessage').off('click', sendNewMessage);
  element
    .find('.text-box')
    .off('keydown', onMetaAndEnter)
    .prop('disabled', true)
    .blur();
  setTimeout(function() {
    element
      .find('.chat')
      .removeClass('enter')
      .show();
    element.click(openElement);
  }, 500);
}

function sendNewMessage() {
  var userInput = $('.text-box');
  var newMessage = userInput
    .html()
    .replace(/\<div\>|\<br.*?\>/gi, '\n')
    .replace(/\<\/div\>/g, '')
    .trim()
    .replace(/\n/g, '<br>');

  if (!newMessage) return;
  // Ike's code begins
  var url = location.href;
  myStorage.sync.get(url, function(notes) {
    notes = Object.keys(notes).length === 0 ? [] : notes[currentUrl];
    notes.push(newMessage);

    var saveObj = {};
    saveObj[url] = notes;
    myStorage.sync.set(saveObj, function() {
      // console.log('Something happend.');
    });
  });

  // Ike's code ends

  var messagesContainer = $('.messages');

  messagesContainer.append(['<li class="self">', newMessage, '</li>'].join(''));

  // clean out old message
  userInput.html('');
  // focus on input
  userInput.focus();

  messagesContainer.finish().animate(
    {
      scrollTop: messagesContainer.prop('scrollHeight'),
    },
    250
  );
}

function onMetaAndEnter(event) {
  if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
    sendNewMessage();
  }
}
