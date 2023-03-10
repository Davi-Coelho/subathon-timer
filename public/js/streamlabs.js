function streamlabsConnect() {
    document.dispatchEvent(new Event('streamlabsConnected'))
}

function streamlabsDisconnect() {
    document.dispatchEvent(new Event('streamlabsDisconnected'))
}

async function streamlabsEvent(eventData) {

    const event = eventData.message[0]
    let mult = null
    console.log(eventData)

    if (!eventData.for && eventData.type === 'donation' && enableCounter.checked && !limitReached) {
        let amount = 0

        if (event.currency !== inputs.donateCurrency) {
            await fetch(`https://api.exchangerate.host/latest?base=${event.currency}&amount=${event.amount}&symbols=${inputs.donateCurrency}`)
                .then(response => response.text())
                .then(data => {
                    amount = (JSON.parse(data)).rates
                    amount = amount[inputs.donateCurrency]
                })
        } else {
            amount = event.amount
        }

        const times = amount / parseFloat(inputs.donateValue)
        await Neutralino.filesystem.appendFile(`./resumo ${currentLogFile}.txt`, `${event.from} doou R$${amount}\n`)
        mult = inputs.donateSelect === '1' ? 1 : 60

        if (!enableLimit.checked || (countDownDate + times * (parseFloat(inputs.donateCounter) * 1000 * mult)) <= maxTimeValue) {
            countDownDate += times * (parseFloat(inputs.donateCounter) * 1000 * mult)
        } else {
            limitReached = true
            countDownDate = maxTimeValue
        }
        
        if (pause) {
            await countDownFunction()
        }
    }
    if (eventData.for === 'twitch_account' && enableCounter.checked && (socketCheck.checked || !jwtCheck.checked) && !limitReached) {
        switch (eventData.type) {
            case 'subscription':
            case 'resub':
                await Neutralino.filesystem.appendFile(`./resumo ${currentLogFile}.txt`, `${event.name} se inscreveu.\n`)
                mult = inputs.subscriptionSelect === '1' ? 1 : 60

                if (!enableLimit.checked || (countDownDate + parseFloat(inputs.subscriptionCounter) * 1000 * mult) <= maxTimeValue) {
                    countDownDate += parseFloat(inputs.subscriptionCounter) * 1000 * mult
                } else {
                    limitReached = true
                    countDownDate = maxTimeValue
                }

                if (pause) {
                    await countDownFunction()
                }
                break
            case 'bits':
                await Neutralino.filesystem.appendFile(`./resumo ${currentLogFile}.txt`, `${event.name} doou ${event.amount} bits.\n`)
                const times = event.amount / parseFloat(inputs.bitsValue)
                mult = inputs.bitsSelect === '1' ? 1 : 60

                if (!enableLimit.checked || (countDownDate + times * (parseFloat(inputs.bitsCounter) * 1000) * mult) <= maxTimeValue) {
                    countDownDate += times * (parseFloat(inputs.bitsCounter) * 1000 * mult)
                } else {
                    limitReached = true
                    countDownDate = maxTimeValue
                }

                if (pause) {
                    await countDownFunction()
                }
                break
        }
    }
}
