import { useState, Fragment } from "react"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Button from "@mui/material/Button"
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom"
import { downloadJSON } from "../../utils/api"
import { useSelector } from "react-redux/es/hooks/useSelector";
export default function ErroFallback(props) {
    const { error, errorInfo } = props

    const config = useSelector(state => state)

    const location = useLocation()?.pathname
    const splittedLocation = location.split("/")
    const errorPath = splittedLocation[splittedLocation.length - 1]

    const steps = [
        'Identify the crashed page',
        'Create a backup',
        'Contact a4GATE development team',
    ];
    const content = [
        `The crashed page is ${errorPath}`,
        'Create an a4CONF JSON backup by clicking "download JSON" from the dialog menu at the bottom-right',
        'Send an email to: a4gate.bug@applied.it explaining the problem sending "report.json" as attachment'
    ]
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };



    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image="/img/error-image.jpg"
                title="This is embarassing..."
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Oops! There has been an error...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The a4CONF page that you visited has some data problem...
                    Try to load a previous JSON backup and restart application
                </Typography>
            </CardContent>
            <CardContent>
                <Typography>
                    Please contact a4GATE development team
                </Typography>
                <Divider />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>What to do now?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            {activeStep === steps.length ? (
                                <Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        We apologize for this problem
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleReset}>Return</Button>
                                    </Box>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Typography sx={{ mt: 2, mb: 1, p: 1 }}>{content[activeStep]}</Typography>
                                    {activeStep === 1 && <div style={{ textAlign: 'center' }}> <Button variant="contained" onClick={() => { downloadJSON(config, errorPath, config?.system?.hostname?.customer) }}>
                                        Download report
                                    </Button></div>}


                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        <Button onClick={handleNext}>
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </Box>
                                </Fragment>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>

            </CardContent>
        </Card>
    )
}