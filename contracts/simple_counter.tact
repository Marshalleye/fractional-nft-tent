// Message definitions
message Add {
    amount: Int as uint32;
}

message Subtract {
    amount: Int as uint32;
}

contract SimpleCounter (
    id: Int as uint32,
    counter: Int as uint32,
    owner: Address,
    operationCount: Int as uint32,
) {
    
    // Deployment receiver - sets the owner
    receive() {
        self.owner = sender();
        cashback(sender());
    }
    
    // Add to counter
    receive(msg: Add) {
        self.counter += msg.amount;
        self.operationCount += 1;
        cashback(sender());
    }
    
    // Subtract from counter (with safety check)
    receive(msg: Subtract) {
        require(self.counter >= msg.amount, "Not enough balance to subtract");
        self.counter -= msg.amount;
        self.operationCount += 1;
        cashback(sender());
    }
    
    // Simple text messages
    receive("increment") {
        self.counter += 1;
        self.operationCount += 1;
        cashback(sender());
    }
    
    receive("decrement") {
        require(self.counter > 0, "Counter cannot go below zero");
        self.counter -= 1;
        self.operationCount += 1;
        cashback(sender());
    }
    
    // Only owner can reset
    receive("reset") {
        require(sender() == self.owner, "Only owner can reset counter");
        self.counter = 0;
        self.operationCount += 1;
        cashback(sender());
    }
    
    // Double the counter
    receive("double") {
        self.counter *= 2;
        self.operationCount += 1;
        cashback(sender());
    }
    
    // Getter functions
    get fun counter(): Int {
        return self.counter;
    }
    
    get fun id(): Int {
        return self.id;
    }
    
    get fun owner(): Address {
        return self.owner;
    }
    
    get fun operationCount(): Int {
        return self.operationCount;
    }
    
  
}