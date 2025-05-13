import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Fade,
  InputAdornment,
  Alert,
  CircularProgress,
  Slide,
  Zoom,
  Divider,
  CssBaseline,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MessageIcon from "@mui/icons-material/Message";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A154B",
      light: "#7D48B1",
      dark: "#2E0D3A",
    },
    secondary: {
      main: "#36C5F0",
      light: "#7ED5F5",
      dark: "#1D9EC7",
    },
    background: {
      default: "#F9F9F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    success: {
      main: "#2ECC71",
    },
    error: {
      main: "#FF6B6B",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: -0.5,
      fontSize: "2rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "12px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
});

const delayUnits = [
  {
    label: "Seconds",
    value: "seconds",
    icon: <AccessTimeIcon fontSize="small" />,
  },
  {
    label: "Minutes",
    value: "minutes",
    icon: <AccessTimeIcon fontSize="small" />,
  },
  {
    label: "Hours",
    value: "hours",
    icon: <AccessTimeIcon fontSize="small" />,
  },
];

const getMilliseconds = (value, unit) => {
  switch (unit) {
    case "seconds":
      return value * 1000;
    case "minutes":
      return value * 60 * 1000;
    case "hours":
      return value * 60 * 60 * 1000;
    default:
      return 0;
  }
};

const App = () => {
  const [delayValue, setDelayValue] = useState("");
  const [delayUnit, setDelayUnit] = useState("seconds");
  const [message, setMessage] = useState("");
  const [hookUrl, setHookUrl] = useState("");
  const [buttonText, setButtonText] = useState("Schedule Message");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (delayValue) {
      setButtonText(`Schedule for ${delayValue} ${delayUnit}`);
    } else {
      setButtonText("Schedule Message");
    }
  }, [delayValue, delayUnit]);

  const isButtonDisabled = !delayValue || !message || !hookUrl;

  const handleSend = async () => {
    setError(null);
    setIsSending(true);
    const delayMs = getMilliseconds(parseInt(delayValue), delayUnit);
    setButtonText("Scheduling...");

    try {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      const response = await fetch("http://localhost:3001/send-to-slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hookUrl,
          message: `From James Cruz's Slack Bot: ${message}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      setButtonText("Message Sent!");
    } catch (err) {
      setError(err.message || "Failed to send message");
      setButtonText("Try Again");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setDelayValue("");
    setMessage("");
    setHookUrl("");
    setIsSuccess(false);
    setButtonText("Schedule Message");
  };

  // Slack Webhook URL validation
  const isValidUrl = (url) => {
    const regex = /^https:\/\/hooks\.slack\.com\/services\/.*/;
    return regex.test(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          mb: 8,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: "linear-gradient(to bottom right, #f9f9f9, #ffffff)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #4A154B 0%, #36C5F0 100%)",
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box textAlign="center" mb={4}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zoom in>
                    <MessageIcon
                      color="primary"
                      sx={{
                        fontSize: 60,
                        mb: 2,
                        filter: "drop-shadow(0 4px 8px rgba(74, 21, 75, 0.2))",
                      }}
                    />
                  </Zoom>
                </motion.div>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    background:
                      "linear-gradient(45deg, #4A154B 30%, #36C5F0 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Delayed Slack Messenger
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  Schedule messages to be sent later
                </Typography>
              </Box>

              <AnimatePresence>
                {error && (
                  <Slide direction="down" in mountOnEnter unmountOnExit>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        boxShadow: "0 2px 8px rgba(255, 107, 107, 0.2)",
                        borderLeft: "4px solid #FF6B6B",
                      }}
                    >
                      {error}
                    </Alert>
                  </Slide>
                )}
                {isSuccess && (
                  <Slide direction="down" in mountOnEnter unmountOnExit>
                    <Alert
                      icon={
                        <motion.div
                          animate={{ scale: [0.8, 1.1, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircleIcon fontSize="inherit" />
                        </motion.div>
                      }
                      severity="success"
                      sx={{
                        mb: 3,
                        boxShadow: "0 2px 8px rgba(46, 204, 113, 0.2)",
                        borderLeft: "4px solid #2ECC71",
                      }}
                    >
                      Your message has been successfully scheduled!
                    </Alert>
                  </Slide>
                )}
              </AnimatePresence>

              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ position: "relative" }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <TextField
                        type="number"
                        label="Delay Amount"
                        fullWidth
                        value={delayValue}
                        onChange={(e) => setDelayValue(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon color="action" />
                            </InputAdornment>
                          ),
                          inputProps: { min: 1 },
                        }}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#e0e0e0",
                              transition: "border-color 0.3s",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4A154B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4A154B",
                              boxShadow: "0 0 0 2px rgba(74, 21, 75, 0.2)",
                            },
                          },
                        }}
                      />
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <TextField
                        select
                        label="Time Unit"
                        fullWidth
                        value={delayUnit}
                        onChange={(e) => setDelayUnit(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#e0e0e0",
                              transition: "border-color 0.3s",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4A154B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4A154B",
                              boxShadow: "0 0 0 2px rgba(74, 21, 75, 0.2)",
                            },
                          },
                        }}
                      >
                        {delayUnits.map((unit) => (
                          <MenuItem key={unit.value} value={unit.value}>
                            <Box display="flex" alignItems="center">
                              {unit.icon}
                              <Box ml={1.5}>{unit.label}</Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider
                      sx={{
                        my: 1,
                        background:
                          "linear-gradient(to right, transparent, #e0e0e0, transparent)",
                        height: "1px",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <TextField
                        fullWidth
                        label="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        multiline
                        minRows={3}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#e0e0e0",
                              transition: "border-color 0.3s",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4A154B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4A154B",
                              boxShadow: "0 0 0 2px rgba(74, 21, 75, 0.2)",
                            },
                          },
                        }}
                      />
                    </motion.div>
                  </Grid>

                  <Grid item xs={12}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <TextField
                        fullWidth
                        label="Slack Webhook URL"
                        value={hookUrl}
                        onChange={(e) => setHookUrl(e.target.value)}
                        error={hookUrl && !isValidUrl(hookUrl)}
                        helperText={
                          hookUrl && !isValidUrl(hookUrl)
                            ? "Please enter a valid Slack Webhook URL."
                            : ""
                        }
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#e0e0e0",
                              transition: "border-color 0.3s",
                            },
                            "&:hover fieldset": {
                              borderColor: "#4A154B",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#4A154B",
                              boxShadow: "0 0 0 2px rgba(74, 21, 75, 0.2)",
                            },
                          },
                        }}
                      />
                    </motion.div>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        disabled={isButtonDisabled || isSending}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                          maxWidth: 400,
                          fontWeight: 600,
                        }}
                      >
                        {isSending ? (
                          <>
                            <CircularProgress size={24} color="secondary" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <SendIcon />
                            {buttonText}
                          </>
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Paper>
        </Fade>
      </Container>
    </ThemeProvider>
  );
};

export default App;
