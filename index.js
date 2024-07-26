const TelegramBot = require('node-telegram-bot-api');

const token = '7027729964:AAFi91k74ZuRrT2QXSkF5T46O2PDO0Z4iSI';
const bot = new TelegramBot(token, { polling: true });

const commands = [
  { command: 'start', description: 'Start the quiz' }
];
bot.setMyCommands(commands);

const quizQuestions = [
  {
    question: 'Որ երկրի մայրաքաղաքն է Աթենքը ',
    variants: ['Հունաստան', 'Հունգարիա', 'ԱՄԷ', 'Բուլղարիա'],
    correctAnswer: 'Հունաստան'
  },
  {
    question: 'Ո՞ր ռեսուրսներն են զբոսաշրջային',
    variants: ['կենսաբանական', 'կլիմայական', 'ռեկրացիոն', 'ջրային'],
    correctAnswer: 'ռեկրացիոն'
  },
  {
    question: 'Որը՞ զբոսաշրջության տեսակ չէ',
    variants: ['ներգնա', 'արտագնա', 'ներքին', 'արտաքին'],
    correctAnswer: 'արտաքին'
  },
  {
    question: 'Ո՞ր նպատակով չի իրականացվում զբոսաշրջություն',
    variants: ['ճանաչողական', 'գիտական', 'ֆինանսական', 'սպորտային'],
    correctAnswer: 'ֆինանսական'
  },
  {
    question: 'Հանգստի կազմակերպումը հանրապետության ներսում կոչվում է՝',
    variants: ['Միջպետական', 'Միջազգային', 'ներքին', 'արտաքին'],
    correctAnswer: 'ներքին'
  }
];

const userProgress = {};


const startQuiz = (chatId) => {
  userProgress[chatId] = { questionIndex: 0 };
  const question = quizQuestions[0];
  bot.sendMessage(chatId, question.question, {
    reply_markup: {
      keyboard: question.variants.map(answer => [answer]),
      one_time_keyboard: true
    }
  });
};


const handleAnswer = (chatId, answer) => {
  const user = userProgress[chatId];
  const question = quizQuestions[user.questionIndex];
  
  if (answer === question.correctAnswer) {
    user.questionIndex += 1;
    if (user.questionIndex < quizQuestions.length) {
      const nextQuestion = quizQuestions[user.questionIndex];
      bot.sendMessage(chatId, nextQuestion.question, {
        reply_markup: {
          keyboard: nextQuestion.variants.map(ans => [ans]),
          one_time_keyboard: true
        }
      });
    } else {
      bot.sendMessage(chatId, 'Ապրես, դու պատասխանել ես ճիշտ բոլոր հարցերին!', {
        reply_markup: { remove_keyboard: true }
      });
      delete userProgress[chatId];
    }
  } else {
    bot.sendMessage(chatId, `Սխալ պատասխան։ ${question.question}`, {
      reply_markup: {
        keyboard: question.variants.map(ans => [ans]),
        one_time_keyboard: true
      }
    });
  }
};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    startQuiz(chatId);
  } else if (userProgress[chatId]) {
    handleAnswer(chatId, text);
  } else {
    bot.sendMessage(chatId, 'Սխալ  /start, ');
  }
});
