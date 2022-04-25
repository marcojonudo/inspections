package inspections.async

import groovy.transform.CompileStatic

@CompileStatic
class SaveInspectionSemaphore {

    private static List<OrderSemaphore> orderSemaphores = []
    private static List<Integer> waitingOrderNumbers = []

    static OrderSemaphore find(int orderNumber) {
        return orderSemaphores.find { it.orderNumber == orderNumber }
    }

    static void removeWaitingNumber(int orderNumber) {
        boolean waiting = isWaiting(orderNumber)
        if (waiting) {
            waitingOrderNumbers.removeIf { it == orderNumber }
        }
    }

    static boolean isWaiting(int orderNumber) {
        return orderNumber in waitingOrderNumbers
    }

    static void acquire(int orderNumber) {
        OrderSemaphore orderSemaphore = find(orderNumber)
        if (orderSemaphore) {
            waitingOrderNumbers << orderNumber
        } else {
            orderSemaphore = new OrderSemaphore(orderNumber)
            orderSemaphores << orderSemaphore
        }
        orderSemaphore.semaphore.acquire()
        removeWaitingNumber(orderNumber)
    }

    static void release(int orderNumber) {
        OrderSemaphore orderSemaphore = find(orderNumber)
        boolean waiting = isWaiting(orderNumber)
        if (!waiting) {
            orderSemaphores.remove(orderSemaphore)
        }
        orderSemaphore.semaphore.release()
    }

}
