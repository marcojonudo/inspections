package inspections.pogos.slack.structure.blocks

import groovy.transform.CompileStatic
import inspections.pogos.slack.structure.elements.SlackBaseElem

@CompileStatic
class SlackTextBlock extends SlackBlock {

    SlackBaseElem text

    SlackTextBlock(SlackBaseElem textElem, SlackBaseElem accessory = null) {
        super("section")
        this.text = textElem
        this.accessory = accessory
    }

}
