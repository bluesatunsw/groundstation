# Signal Processing

*This is all preliminary information I've found and should not be taken as final.*

## Decoding Pipeline

SDR -> GNU Radio -> Database -> Frontend

The specific Software Defined Radio that will be used is currently unkown however during testing will be the [HackRF One](https://greatscottgadgets.com/hackrf/one/). This specific SDR is likely overkill for our specific application as it also includes the ability to transmit signals which isn't currently planned for the groundstation. The bandwidth and range of most SDR devices should be sufficient for the satellites that can be detected with our planned hardware. The only other potential consideration would be the ability to introduce a [filtered preamp](https://store.uputronics.com/index.php?route=product/category&path=59) for any specific satellite frequencies that need a stronger signal.

I have found that using an existing Satellite decoding library would be most advantageous for our application and from my research it appears that the [gr-satellites](https://github.com/daniestevez/gr-satellites) GNU module would be the best option for this. The project has been supported for 7 years and supports hundreds of satellites with support for new launches added quickly. The program also has the advantage of being easily implemented as it works as a GNU Radio module which is where our previous research has been focused. I have created a JSON file contating the various supported satellites and the frequencies that they transmit on in this folder.

The gr-satellites GNU Radio [block](https://gr-satellites.readthedocs.io/en/latest/satellite_decoder.html) outputs the decoded data in [PDUs](https://wiki.gnuradio.org/index.php/Message_Passing) which can either be logged directly to a text file or processed further with other GNU blocks. I think the best course of action would be to default to simply logging the message as text and manually building up capabilities on a per satellite basis such as telemetry classification and image visualisation. I don't have any suggestions for the design of the database to store this data so I will leave that open for discussion.

To actually display the decoded data on the frontend we can either stream it directly from GNU Radio or the database, we will have to consider the technical complexitiy, performance, and speed implications of each option. 
