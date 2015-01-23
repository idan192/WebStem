#ifndef GAME_BUILDER
#define GAME_BUILDER

#include "CardsStack.h"

/*
	Main "Game" class.
	Allocates a deck of input size, 
	and counts the amount of rounds to shuffle.
	Returns that number as a result.
*/
class GameBuilder {
private:
	// Main decks of cards
	CardsStack *pDeck = NULL;
	
	bool finishedIteration() {
		return pDeck->validateHand();
	}

	void shuffleAll() {
		// Run moves until we need to swap decks
		while (pDeck->nextShuffle());
	}

public:
	GameBuilder(int nSize) {
		// Create a full deck of size n (hand)
		pDeck = new CardsStack(nSize);
	}

	virtual ~GameBuilder() {
		delete pDeck;
	}

	/*
		Compute number of round to shuffle before returning
		to original stack order.
		Empty hand means nothing to do.

		@param		 - <none>
		@return	long - number of rounds
	*/
	long computeRounds() {
		// Memory allocation error
		if (pDeck == NULL) {
			return -1;
		}

		int nRounds = 0;
		if (!pDeck->emptyHand()) {
			do {
				++nRounds;
				// Shuffle until used all cards in "hand" stack
				shuffleAll();
				// FinishedIteration - is original order
			} while (!finishedIteration());
		}
		return nRounds;
	}
};

#endif // GAME_BUILDER