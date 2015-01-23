/*
This module solves a coding problem that involves shuffling a deck of cards.  The problem description is as follows:

You are given a deck containing n cards.  While holding the deck:

1. Take the top card off the deck and set it on the table
2. Take the next card off the top and put it on the bottom of the deck in your hand.
3. Continue steps 1 and 2 until all cards are on the table.  This is a round.
4. Pick up the deck from the table and repeat steps 1-3 until the deck is in the original order.

Write a program to determine how many rounds it will take to put a deck back into the original order. 
This will involve creating a data structure to represent the order of the cards.  
This program should be written in C or C++.  Do not use STL.  
It should take a number of cards in the deck as a command line argument and write the result to stdout.
*/

#include "ErrorNotifier.h"
#include "GameBuilder.h"
#include <sstream>

using namespace ErrorNotifier;

/*
	Parses constant string into an exact single long integer value.
	Incorrect value (more than one, negative, etc.) would cause an error and exit.

	@param arg - input constant string as a long value.
	@return <none> - exit program in case of an error.
*/
long parseInputNumber(const char* arg) {
	long number;
	std::istringstream stream(arg);
	if (stream.good() && stream >> number && 
		stream.eof() && number >= 0) {
			return number;
	}
	errorNotifyAndExit(BAD_INPUT);
	return 0; // will never happen
}

/*
	Main program that runs simulation 

	@param argc - number of parameters (expected 2, program name and number of cards)
	@param argv - array of string parameters. Second parameter is number of cards
	@return <none> - exit program in case of an error.
*/
int main(int argc, const char* argv[]) {
	if (argc != 2) {
		// Number of inputs is invalid. 
		errorNotifyAndExit(NO_PARAMS);
	}
	// Valid number of cards in deck
	long nCards = parseInputNumber(argv[1]);

	// Run shuffling algorithm until we get back to initial state
	GameBuilder deckBuilder(nCards);
	long nRounds = deckBuilder.computeRounds();
	if (nRounds < 0) {
		errorNotifyAndExit(NO_MEMORY);
	}

	cout << nRounds << endl;
	return nRounds;
}