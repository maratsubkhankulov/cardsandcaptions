import {CaptionCard, ImageCard, Player} from './game.js';

export function fillCardStacks(game) {
	game.addCaptionCard(new CaptionCard(1, "Caption 1"));
	game.addCaptionCard(new CaptionCard(2, "Caption 2"));
	game.addCaptionCard(new CaptionCard(3, "Caption 3"));
	game.addCaptionCard(new CaptionCard(4, "Caption 4"));
	game.addCaptionCard(new CaptionCard(5, "Caption 5"));
	game.addCaptionCard(new CaptionCard(6, "Caption 6"));
	game.addCaptionCard(new CaptionCard(7, "Caption 7"));
	game.addCaptionCard(new CaptionCard(8, "Caption 8"));

	game.addImageCard(new ImageCard(1, "./img/1.jpg"));
	game.addImageCard(new ImageCard(2, "./img/2.jpg"));
	game.addImageCard(new ImageCard(3, "./img/3.jpg"));
	game.addImageCard(new ImageCard(4, "./img/4.jpg"));
	game.addImageCard(new ImageCard(5, "./img/5.jpg"));
	game.addImageCard(new ImageCard(6, "./img/6.jpg"));
	game.addImageCard(new ImageCard(7, "./img/7.jpg"));
	game.addImageCard(new ImageCard(8, "./img/8.jpg"));
	game.addImageCard(new ImageCard(9, "./img/1.jpg"));
	game.addImageCard(new ImageCard(10, "./img/2.jpg"));
	game.addImageCard(new ImageCard(11, "./img/3.jpg"));
	game.addImageCard(new ImageCard(12, "./img/4.jpg"));
	game.addImageCard(new ImageCard(13, "./img/5.jpg"));
	game.addImageCard(new ImageCard(14, "./img/6.jpg"));
	game.addImageCard(new ImageCard(15, "./img/7.jpg"));
	game.addImageCard(new ImageCard(16, "./img/8.jpg"));
	game.addImageCard(new ImageCard(17, "./img/1.jpg"));
	game.addImageCard(new ImageCard(18, "./img/2.jpg"));
	game.addImageCard(new ImageCard(19, "./img/3.jpg"));
	game.addImageCard(new ImageCard(20, "./img/4.jpg"));
}

export function fillPlayers(game) {
	game.addPlayer(new Player("Steven"));
	game.addPlayer(new Player("Jack"));
	game.addPlayer(new Player("Alice"));
}
