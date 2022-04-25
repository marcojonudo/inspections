package inspections.async

import groovy.transform.CompileStatic

import java.util.concurrent.Semaphore

@CompileStatic
class OrderSemaphore {

    int orderNumber
    Semaphore semaphore

    OrderSemaphore(int orderNumber) {
        this.orderNumber = orderNumber
        semaphore = new Semaphore(1)
    }

}
