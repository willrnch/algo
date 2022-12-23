class LinkedList {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const swapNodes = (head) => {
  if (head.next) {
    const newHead = head.next;
    head.next = head.next.next;
    newHead.next = head;
    return newHead;
  }
  return head;
};

function nodeSwap(head) {
  const newHead = swapNodes(head);

  let it = newHead.next;

  while (it && it.next) {
    it.next = swapNodes(it.next);
    it = it.next.next;
  }

  return newHead;
}

exports.nodeSwap = nodeSwap;
exports.LinkedList = LinkedList;

