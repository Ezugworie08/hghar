var widgetContent = `
<div class="floating-chat">
    <i class="fa fa-comments" aria-hidden="true"></i>
    <div class="chat">
        <div class="header">
            <span class="title">
                what's on your mind?
            </span>
            <button>
                <i class="fa fa-minus" aria-hidden="true"></i>
            </button>
        </div>
        <ul class="messages">
            <li class="other">asdasdasasdasdasasdasdasasdasdasasdasdasasdasdasasdasdas</li>
            <li class="other">Are we dogs??? 🐶</li>
            <li class="self">no... we're human</li>
            <li class="other">are you sure???</li>
            <li class="self">yes.... -___-</li>
            <li class="other">if we're not dogs.... we might be monkeys 🐵</li>
            <li class="self">i hate you</li>
            <li class="other">don't be so negative! here's a banana 🍌</li>
            <li class="self">......... -___-</li>
        </ul>
        <div class="footer">
            <div class="text-box" contenteditable="true" disabled="true"></div>
            <button id="sendMessage">send</button>
        </div>
    </div>
</div>
`;

$('body').prepend(widgetContent);

var element = $('.floating-chat');

// Entry point
element.click(openElement);

var myStorage = chrome.storage.local;
myStorage.get('chatID', function(chatID) {
  if (!chatID) {
    myStorage.set('chatID', createUUID());
  }
});

setTimeout(function() {
  element.addClass('enter');
}, 1000);

// $('a').click(function() {
//   alert("Hey there");
// })

// var element = $('.floating-chat');
// var myStorage = localStorage;

// if (!myStorage.getItem('chatID')) {
//   myStorage.setItem('chatID', createUUID());
// }

function openElement() {
  myStorage.get('chatID', function(chatID) {
    console.log('chatID: ', chatID);
  });

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

function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
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
