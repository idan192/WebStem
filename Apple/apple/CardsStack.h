#ifndef CARDS_STACK
#define CARDS_STACK

#include "CardLink.h"
#include "XORList.h"

/*
	This class hold N cards in memory as an array,
	to optimize cache hits instead of random list pointers.
	It uses XORList to hold two compressed double linked lists 
	(require a single pointer instead of two), one is a "hand" stack
	and the other is a "table" stack.

	Flow: 
	1. Allocate N cards
	2. Add N cards (in order) to "hand" stack, "table" stack remains empty
	3. Shuffle: 
		- Remove top card from hand stack, put it on top the table stack
		- Remove top card from hand stack, put it at the bottom of hand stack
		- Continue as long there are cards in "hand" stack
	4. Move table stack to hand ("swap")
	5. Validate order. In case order is not original one - continue to 3
	6. Count the amount of 3-5 iterations and return that value.

	How do I validate order?
	- Allocations of stacks is sequential (in virtual memory, on the heap)
	- Make sure that every 2 adjacent cards, differentiate in distance of sizeof(Card) == 64bit, single pointer
	- If all have the same distance - return finished
*/
class CardsStack {
private: 
	// Number of total cards
	unsigned nCards;
	// List of all cards for spatial adjacency
	CardLink *pCards;
	// Compressed double linked list of "hand" stack
	XORList<CardLink> hand;
	// Compressed double linked list of "table" stack
	XORList<CardLink> table;
	
	// Since we allocate memory sequentially, two adjacent
	// pointers in original order have exactly difference of a single size of card
	bool wrongDistance(CardLink* pPrev, CardLink* pCurr) {
		unsigned long distance = ((unsigned long)pCurr) - ((unsigned long)pPrev);
		return ((pCurr != NULL) && (distance != sizeof(CardLink)));
	}

	// Initialize "hand" stack to be all cards allocated
	void initializeHand() {
		// Initialize all links in between
		for (unsigned card = 0; card < nCards; ++card) {
			CardLink *pNext = &pCards[card];
			hand.addLast(pNext);
		}
	}

public:
	CardsStack(int nCards) {
		this->nCards = nCards;
		pCards = new CardLink[nCards];

		// Initialize hand with all cards
		initializeHand();
	}

	virtual ~CardsStack() {
		delete[] pCards;
	}	
	
	/*
		True iff order of cards in stack is original allocation order.

		@param		 - <none>
		@return	bool - allocation order is the same
	*/
	bool validateHand() {
		if (emptyHand()) {
			return true;
		}

		// For every two following cards in stack,
		// check distance of two pointers.
		// If distance always exactly one CardLink allocation size
		// it means the stack is sorted to original order - return true
		CardLink* prev = NULL;
		CardLink* curr = hand.first();
		do {
			CardLink* tmp = curr;
			curr = XORList<CardLink>::getNext(prev, curr);
			prev = tmp;
			if (wrongDistance(prev, curr)) {
				return false;
			}
		} while (curr != NULL);
		return true;
	}

	/*
		"Hand" stack is empty.

		@param		 - <none>
		@return	bool - "hand" stack is empty
	*/
	bool emptyHand() {
		return (hand.first() == NULL);
	}


	/*
	Each shuffle works as follows:
	- If empty hand, move table stack back to end
	- Else
		- Take card from hand (top card)
		- Put it on top of the table stack
		- Take card from hand (top card)
		- (If card exists) put it at the bottom of hand card (last card)

	@param		 - <none>
	@return	bool - false if used all hand cards and swapped table stack with hand stack
	*/
	bool nextShuffle() {
		if (!emptyHand()) {
			// Move top card to top of stack on table
			CardLink *popToTable = hand.popFirst();
			table.addFirst(popToTable);

			// Move top card to bottom of stack in hand
			CardLink *popToHand = hand.popFirst();
			hand.addLast(popToHand);
			return true;
		}

		// Swap tables
		hand.swap(table);
		return false;
	}
};

#endif // CARDS_STACK