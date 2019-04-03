import {CaptionCard, ImageCard, Player} from './game.js';

export function initGame(game) {
	fillCardStacks(game);

	shuffleArray(game.caption_stack);
	shuffleArray(game.image_stack);

	for (let i = 0; i < game.players.length; i++) {
		game.players[i].hand = [];
		game.players[i].captionCard = null;
		game.players[i].points = [];
		game.players[i].votes = [];
	}

	game.playersFillHands();

	game.startGame();

	let judge = game.getCurrentJudge();
	game.collectCaptionCard(judge);
	game.revealCaptionCard(judge);
}

export function fillCardStacks(game) {
	game.caption_stack = [];
	game.image_stack = [];

	game.addCaptionCard(new CaptionCard(1, "I didn't choose the thug life, the thug life chose me."));
	game.addCaptionCard(new CaptionCard(2, "When a little kid keeps kicking the back of your seat on the airplane."));
	game.addCaptionCard(new CaptionCard(3, "When it's time to split the bill."));
	game.addCaptionCard(new CaptionCard(4, "When you find a dank meme to send to your friends."));
	game.addCaptionCard(new CaptionCard(5, "When that direct deposit hits."));
	game.addCaptionCard(new CaptionCard(6, "This isn't even my final form."));
	game.addCaptionCard(new CaptionCard(7, "Marilize legajuana."));
	game.addCaptionCard(new CaptionCard(8, "When your ex wants you back."));
	game.addCaptionCard(new CaptionCard(9, "When you tell your friends that you're vegan."));
	game.addCaptionCard(new CaptionCard(10, "When your crush responds to your message."));
	game.addCaptionCard(new CaptionCard(11, "When your credit score goes up."));
	game.addCaptionCard(new CaptionCard(12, "When your song comes on in the club."));
	game.addCaptionCard(new CaptionCard(13, "When your phone is on 7%."));
	game.addCaptionCard(new CaptionCard(14, "When it's on sale and they have your size."));
	game.addCaptionCard(new CaptionCard(15, "When you spill your drink on your computer."));
	game.addCaptionCard(new CaptionCard(16, "When someone steps on your fresh kicks."));
	game.addCaptionCard(new CaptionCard(17, "When you get an unwanted nude."));
	game.addCaptionCard(new CaptionCard(18, "When you eat sour candy."));
	game.addCaptionCard(new CaptionCard(19, "When your Uber/Lyft driver talks too much."));
	game.addCaptionCard(new CaptionCard(20, "When your mom makes your favourite food."));
	game.addCaptionCard(new CaptionCard(21, "When you swipe your card and it's declined."));
	game.addCaptionCard(new CaptionCard(22, "When you see somebody spending money and they owe you money."));

	game.addImageCard(new ImageCard(1, "./img/1.jpg"));
	game.addImageCard(new ImageCard(2, "./img/2.jpg"));
	game.addImageCard(new ImageCard(3, "./img/3.gif"));
	game.addImageCard(new ImageCard(4, "./img/4.jpg"));
	game.addImageCard(new ImageCard(5, "./img/5.jpg"));
	game.addImageCard(new ImageCard(6, "./img/6.jpg"));
	game.addImageCard(new ImageCard(7, "./img/7.jpg"));
	game.addImageCard(new ImageCard(8, "./img/8.jpg"));
	game.addImageCard(new ImageCard(9, "./img/9.jpg"));
	game.addImageCard(new ImageCard(10, "./img/10.jpg"));
	game.addImageCard(new ImageCard(11, "./img/11.jpg"));
	game.addImageCard(new ImageCard(12, "./img/12.jpg"));
	game.addImageCard(new ImageCard(13, "./img/13.jpg"));
	game.addImageCard(new ImageCard(14, "./img/14.jpg"));
	game.addImageCard(new ImageCard(15, "./img/15.jpg"));
	game.addImageCard(new ImageCard(16, "./img/16.jpg"));
	game.addImageCard(new ImageCard(17, "./img/17.jpg"));
	game.addImageCard(new ImageCard(18, "./img/18.jpg"));
	game.addImageCard(new ImageCard(19, "./img/19.jpg"));
	game.addImageCard(new ImageCard(20, "./img/20.jpg"));
	game.addImageCard(new ImageCard(21, "./img/21.jpg"));
	game.addImageCard(new ImageCard(22, "./img/omg-bernie.gif"));
	game.addImageCard(new ImageCard(23, "./img/oprah-ok.gif"));
	game.addImageCard(new ImageCard(24, "./img/patience.gif"));
	game.addImageCard(new ImageCard(25, "./img/prince-look.gif"));
	game.addImageCard(new ImageCard(26, "./img/rihanna-lips.gif"));
	game.addImageCard(new ImageCard(27, "./img/sad-crying-blackish.gif"));
	game.addImageCard(new ImageCard(28, "./img/sad-pikachu.gif"));
	game.addImageCard(new ImageCard(29, "./img/shake-head.gif"));
	game.addImageCard(new ImageCard(30, "./img/shaq-shimmy.gif"));
	game.addImageCard(new ImageCard(31, "./img/sponge-bob-thinking.gif"));
	game.addImageCard(new ImageCard(32, "./img/tyler-damn.gif"));
	game.addImageCard(new ImageCard(33, "./img/will-smith-surprised.gif"));
	game.addImageCard(new ImageCard(34, "./img/zoom-suprised.gif"));
}

export function fillPlayers(game) {
	game.addPlayer(new Player("Player1"));
	game.addPlayer(new Player("Player2"));
	game.addPlayer(new Player("Player3"));
}


function shuffleArray(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
	}
	return a;
}
