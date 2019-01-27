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

	game.addImageCard(new ImageCard(1, "img1"));
	game.addImageCard(new ImageCard(2, "img2"));
	game.addImageCard(new ImageCard(3, "img3"));
	game.addImageCard(new ImageCard(4, "img4"));
	game.addImageCard(new ImageCard(5, "img5"));
	game.addImageCard(new ImageCard(6, "img6"));
	game.addImageCard(new ImageCard(7, "img7"));
	game.addImageCard(new ImageCard(8, "img8"));
	game.addImageCard(new ImageCard(9, "img8"));
	game.addImageCard(new ImageCard(10, "img10"));
	game.addImageCard(new ImageCard(11, "img11"));
	game.addImageCard(new ImageCard(12, "img12"));
	game.addImageCard(new ImageCard(13, "img13"));
	game.addImageCard(new ImageCard(14, "img14"));
	game.addImageCard(new ImageCard(15, "img15"));
	game.addImageCard(new ImageCard(16, "img16"));
	game.addImageCard(new ImageCard(17, "img17"));
	game.addImageCard(new ImageCard(18, "img18"));
	game.addImageCard(new ImageCard(19, "img19"));
	game.addImageCard(new ImageCard(20, "img20"));
}

export function fillPlayers(game) {
	game.addPlayer(new Player("Steven"));
	game.addPlayer(new Player("Jack"));
	game.addPlayer(new Player("Alice"));
}
