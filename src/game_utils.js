import {CaptionCard, ImageCard, Player} from './game.js';

export function initGame(game) {
	fillCardStacks(game);

	game.playersFillHands();
	game.startGame();

	let judge = game.getCurrentJudge();
	game.collectCaptionCard(judge);
	game.revealCaptionCard(judge);
}

export function fillCardStacks(game) {
	game.addCaptionCard(new CaptionCard(1, "I didn't choose the thug life, the thug life chose me."));
	game.addCaptionCard(new CaptionCard(2, "Why isn't anybody giving me attention?"));
	game.addCaptionCard(new CaptionCard(3, "When your bus is late."));
	game.addCaptionCard(new CaptionCard(4, "When you find a dank meme to send to your friends."));
	game.addCaptionCard(new CaptionCard(5, "Coffee is ready."));
	game.addCaptionCard(new CaptionCard(6, "This isn't even my final form."));
	game.addCaptionCard(new CaptionCard(7, "Marilize legajuana."));
	game.addCaptionCard(new CaptionCard(8, "That moment when you find the perfect avocado at the supermarket."));
	game.addCaptionCard(new CaptionCard(9, "When you tell your friends that you're vegan."));
	game.addCaptionCard(new CaptionCard(10, "That face you make when you read a post you don't like."));
	game.addCaptionCard(new CaptionCard(11, "I didn't choose the thug life, the thug life chose me."));
	game.addCaptionCard(new CaptionCard(12, "That face you make when your firiend is next to his crush."));
	game.addCaptionCard(new CaptionCard(13, "When you grind a gear."));
	game.addCaptionCard(new CaptionCard(14, "When you can't answer question 1."));
	game.addCaptionCard(new CaptionCard(15, "Just nasty."));
	game.addCaptionCard(new CaptionCard(16, "When you missed out on tickets."));
	game.addCaptionCard(new CaptionCard(17, "When someone walks past and they smell really nice."));
	game.addCaptionCard(new CaptionCard(18, "When you eat sour candy."));
	game.addCaptionCard(new CaptionCard(19, "The internet is down"));
	game.addCaptionCard(new CaptionCard(20, "When your mom makes your favourite food."));
	game.addCaptionCard(new CaptionCard(21, "When you swipe your card and it's declined."));
	game.addCaptionCard(new CaptionCard(22, "When you see somebody spending money and they owe you money."));

	game.addImageCard(new ImageCard(1, "./1.jpg"));
	game.addImageCard(new ImageCard(2, "./2.jpg"));
	game.addImageCard(new ImageCard(3, "./3.gif"));
	game.addImageCard(new ImageCard(4, "./4.jpg"));
	game.addImageCard(new ImageCard(5, "./5.jpg"));
	game.addImageCard(new ImageCard(6, "./6.jpg"));
	game.addImageCard(new ImageCard(7, "./7.jpg"));
	game.addImageCard(new ImageCard(8, "./8.jpg"));
	game.addImageCard(new ImageCard(9, "./9.jpg"));
	game.addImageCard(new ImageCard(10, "./10.jpg"));
	game.addImageCard(new ImageCard(11, "./11.jpg"));
	game.addImageCard(new ImageCard(12, "./12.jpg"));
	game.addImageCard(new ImageCard(13, "./13.jpg"));
	game.addImageCard(new ImageCard(14, "./14.jpg"));
	game.addImageCard(new ImageCard(15, "./15.jpg"));
	game.addImageCard(new ImageCard(16, "./16.jpg"));
	game.addImageCard(new ImageCard(17, "./17.jpg"));
	game.addImageCard(new ImageCard(18, "./18.jpg"));
	game.addImageCard(new ImageCard(19, "./19.jpg"));
	game.addImageCard(new ImageCard(20, "./20.jpg"));
	game.addImageCard(new ImageCard(21, "./21.jpg"));
}

export function fillPlayers(game) {
	game.addPlayer(new Player("Player1"));
	game.addPlayer(new Player("Player2"));
	game.addPlayer(new Player("Player3"));
}
