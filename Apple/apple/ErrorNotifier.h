#ifndef ERROR_NOTIFIER
#define ERROR_NOTIFIER

#include <cstdlib>
#include <iostream>
using namespace std;

/*
	Central errors notifier manager.
	Exits in case of a fatal error.
*/
namespace ErrorNotifier {
	enum Errors {
		BAD_INPUT = -8819,
		NO_PARAMS,
		NO_MEMORY
	};

	/*
		Prints an error message and exits in case of a fatal error value.

		@param error - Error enum.
		@return		 - <none>
	*/
	void errorNotifyAndExit(Errors error) {
		switch (error) {
			case BAD_INPUT: 
				cerr << "Input number of cards is invalid." << endl;
				break;
			case NO_PARAMS:
				cerr << "Not enough or too many input arguments received through command line." << endl;
				break;
			case NO_MEMORY:
				cerr << "Memory allocation failed (probably out of memory)." << endl;
				break;
			default: 
				return;
		}
		exit(-1);
	}
};

#endif // ERROR_NOTIFIER