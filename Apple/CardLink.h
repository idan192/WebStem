#ifndef CARD_LINK
#define CARD_LINK

/*
	This class represents a single card in memory.
	It holds an auxiliary pointer to "next card",
	and defines a getter and a setter to that pointer.
	- It is possible to optimize memory by bounding pointer (as relative offset)
	  to short (16 bits) instead of using 64 bits of pointer.
*/
class CardLink {
private: 
	CardLink *pOther;

public:
	CardLink() : pOther(NULL) { }

	/*
		Setter of auxiliary "next card" pointer

		@param other - the pointer to replace with current one.
		@return		 - <none>
	*/
	void setPtr(CardLink* other) {
		this->pOther = other;
	}

	/*
		Getter of auxiliary "next card" pointer

		@param			  - <none>
		@return CardLink* - the pointer defined as "next card"
	*/
	CardLink* getPtr() const {
		return this->pOther;
	}
};

#endif // CARD_LINK