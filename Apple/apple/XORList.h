#ifndef XOR_LIST
#define XOR_LIST

/*
	My implementation for a generic double linked list.
	- It XORS previous and current auxiliary pointer to get next pointer on list.
	- It XORS next and current auxiliary pointer to get previous pointer on list.
*/

template <class T>
class XORList {
private:
	// Head and tail pointers of list
	T* pHead;
	T* pTail;

	// Xor pointers to reduce memory for double linked list
	static T* xorPtrs(T* prev, T* next) {
		return (T*)(((unsigned long)prev) ^ ((unsigned long)next));
	}

public:
	// Empty list points to nothing
	XORList() : pHead(NULL), pTail(NULL) { }

	/*
		Get previous/next object given adjacent and current objects

		@param adj, curr  - adjacent (previous / next) pointer and current object
		@return CardLink* - other adjacents object (next / previous one)
	*/
	static T* getNext(T* adj, T* curr) {
		return xorPtrs(adj, curr->getPtr());
	}

	/*
		Swap current list with another reference

		@param other  - other list to swap with current one
		@return		  - <none>
	*/
	void swap(XORList& other) {
		T* pTmpHead = pHead;
		T* pTmpTail = pTail;

		pHead = other.pHead;
		pTail = other.pTail;

		other.pHead = pTmpHead;
		other.pTail = pTmpTail;
	}

	/*
		Add object to head of list

		@param obj  - object to add to top of current stack
		@return		- <none>
	*/
	void addFirst(T* obj) {
		if (obj == NULL) {
			return;
		}
		if (pHead == NULL && pTail == NULL) {
			pHead = pTail = obj;
		}
		else {
			obj->setPtr(xorPtrs(NULL, pHead));
			pHead->setPtr(xorPtrs(obj, pHead->getPtr()));
			pHead = obj;
		}
	}

	/*
		Add object to tail of list

		@param obj  - object to add to end of current stack
		@return		- <none>
	*/
	void addLast(T* obj) {
		if (obj == NULL) {
			return;
		}
		if (pHead == NULL && pTail == NULL) {
			pHead = pTail = obj;
		}
		else {
			obj->setPtr(xorPtrs(pTail, NULL));
			pTail->setPtr(xorPtrs(pTail->getPtr(), obj));
			pTail = obj;
		}
	}

	/*
		Pop first object on list and return it.
		In case stack is empty return NULL.

		@param   - <none>
		@return T* - first object popped. NULL if list is empty
	*/
	T* popFirst() {
		T *first = pHead;
		if (pHead == pTail) {
			pHead = pTail = NULL;
		}
		else {
			T *next = first->getPtr();
			if (next == NULL) {
				pHead = pTail = NULL;
			}
			else {
				T *after = xorPtrs(first, next->getPtr());
				next->setPtr(after);
				first->setPtr(NULL);
				pHead = next;
			}
		}
		return first;
	}

	/*
		Pop last object on list and return it.
		In case stack is empty return NULL.

		@param   - <none>
		@return T* - last object popped. NULL if list is empty
	*/
	T* popLast() {
		T *last = pTail;
		if (pHead == pTail) {
			pHead = pTail = NULL;
		}
		else {
			T *prev = last->getPtr();
			if (prev == NULL) {
				pHead = pTail = last;
			}
			else {
				T *before = xorPtrs(prev->getPtr(), last);
				prev->setPtr(before);
				last->setPtr(NULL);
				pTail = prev;
			}
		}
		return last;
	}

	/*
		Get first object on list.
		In case stack is empty return NULL.

		@param   - <none>
		@return T* - first object. NULL if list is empty
	*/
	T* first() const {
		return pHead;
	}

	/*
		Get last object on list.
		In case stack is empty return NULL.

		@param   - <none>
		@return T* - last object. NULL if list is empty
	*/
	T* last() const {
		return pTail;
	}

};

#endif // XOR_LIST