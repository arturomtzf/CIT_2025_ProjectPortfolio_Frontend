import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getToken } from "../../utils/tokenHelper";

const RatingModal = ({ show, handleClose, titleid, load }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!rating) return;

        try {
            setLoading(true);

            const token = getToken();
            const res = await fetch(`/api/movies/${titleid}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: 'Bearer ' + token } : {})
                },
                body: JSON.stringify({ Rating: rating, Comment: comment })
            });

            if (res.status === 401) {
                throw new Error("You are not authorized. Please log in again.");
            }

            if (!res.ok) {
                throw new Error("Failed to save rating.");
            }

            const data = await res.json();

            handleClose();
            setRating(0);
            setComment("");
            load()
        } catch (err) {
            console.error('Rating error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!show || !titleid) return;

        const getCurrentRating = async () => {
            try {
                const token = getToken();
                const res = await fetch(`/api/movies/${titleid}/rate`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: 'Bearer ' + token } : {})
                    }
                });

                if (res.status === 401) {
                    throw new Error("You are not authorized. Please log in again.");
                }

                if (res.status === 204) {
                    // No existing rating
                    setRating(0);
                    setComment("");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to load rating.");
                }

                const data = await res.json();

                setRating(data.rating ?? 0);
                setComment(data.comment ?? "");
            } catch (err) {
                console.error("Failed to fetch current rating", err);
            }
        };

        getCurrentRating();
    }, [show, titleid]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Rate Movie</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark text-white">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <div className="d-flex gap-1">
                            {[...Array(10)].map((_, i) => {
                                const value = i + 1;
                                return (
                                    <Button
                                        key={value}
                                        variant={value <= rating ? "warning" : "outline-secondary"}
                                        onClick={() => setRating(value)}
                                        size="sm"
                                    >
                                        ★
                                    </Button>
                                );
                            })}
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your thoughts about the movie..."
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="bg-dark text-white">
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={loading || rating === 0}
                >
                    {loading ? "Saving..." : "Save Rating"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RatingModal;
