import { Card, ListGroup, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "react-bootstrap-icons";

const GroupList = ({ onSelectGroup, selectedGroupId, onCreateGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/conversations/`
        );
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const newGroup = {
        groupName: newGroupName.trim(),
        members: [],
        messages: [],
        isGroup: true,
        groupAdmin: sessionStorage.getItem("userName") || "admin",
        groupAdminId: sessionStorage.getItem("userId") || "admin123",
        blockedMembers: [],
      };

      const response = await axios.post(
        `http://localhost:3000/conversations/`,
        newGroup
      );

      // Refresh groups list
      const groupsResponse = await axios.get(
        `http://localhost:3000/conversations/`
      );
      setGroups(groupsResponse.data);

      // Select the new group
      onSelectGroup(response.data);

      // Reset form
      setNewGroupName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  if (loading) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5>Groups</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center">Loading...</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Available Groups</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={16} />
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        {showCreateForm && (
          <div className="p-3 border-bottom">
            <form onSubmit={handleCreateGroup}>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Enter group name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newGroupName.trim()}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewGroupName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        <ListGroup variant="flush">
          {groups.map((group) => (
            <ListGroup.Item
              key={group._id}
              action
              active={selectedGroupId === group._id}
              onClick={() => onSelectGroup(group)}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{group.groupName || "Unnamed Group"}</strong>
                <br />
                <small className="text-muted">
                  {group.members ? group.members.length : 0} members
                </small>
              </div>
              {group.isGroup && <span className="badge bg-primary">Group</span>}
            </ListGroup.Item>
          ))}
          {groups.length === 0 && (
            <ListGroup.Item className="text-center text-muted">
              No groups available
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default GroupList;
