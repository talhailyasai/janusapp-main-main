from main import create_app
import io
import pytest
import json
import logging
from unittest.mock import patch, MagicMock

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@pytest.fixture
def app():
    app = create_app()
    test_config = {
        'TESTING': True,
        'MONGO_URI': 'mongodb://localhost:27017/testfixture',
        'DEBUG': True
    }
    app.config.update(test_config)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def sample_pdf():
    return (io.BytesIO(b"sample PDF content"), 'test.pdf')

def test_upload_file(client, sample_pdf):
    try:
        data = {'file': sample_pdf}
        response = client.post('/api/upload', data=data)
        logger.debug(f"Upload response: {response.data}")
        assert response.status_code == 200
        assert b"filename" in response.data
    except Exception as e:
        logger.error(f"Upload test failed: {str(e)}")
        raise

def test_process_file(client, sample_pdf, mock_aws):
    try:
        # First upload a file
        upload_data = {'file': sample_pdf}
        upload_response = client.post('/api/upload', data=upload_data)
        logger.debug(f"Upload response: {upload_response.data}")
        assert upload_response.status_code == 200

        # Then test processing
        process_data = {'filename': 'test.pdf'}
        response = client.post(
            '/api/process',
            data=json.dumps(process_data),
            content_type='application/json'
        )
        logger.debug(f"Process response: {response.data}")
        assert response.status_code == 200
    except Exception as e:
        logger.error(f"Process test failed: {str(e)}")
        raise

def test_cleanup(client):
    response = client.delete(
        '/api/cleanup',
        headers={'Content-Type': 'application/json'}
    )
    assert response.status_code == 200
    assert b"All data deleted" in response.data

